document.documentElement.scrollTop=0

var artyom = new Artyom();

var answer = null;

function changeMode(mode){
    document.getElementById("pattern").innerText=mode;
}



function transformToPinYin(text){
    $.get("http://api.tianapi.com/pinyin/index?key=94b1ce35f4803078d9f8afc89825f03c&text="+text,function(data){
    console.log(data);
    var jianxie = data.newslist[0].jianxie    
        console.log(jianxie);    
        return jianxie
    })
} 


function say(content,time){
    artyom.dontObey();
    artyom.say(content);
    setTimeout(() => {
        // Enable command recognition again
        artyom.obey();
        // Try to say hello again and now the command will be recognized
    }, time);
}

artyom.addCommands([
    // 天气查询
    {
        indexes: ["猜地名*"],
        smart:true,
        action:(i,wildcard)=>{
            changeMode("猜地名模式")
            if(wildcard!=""){
                console.log(answer);
                console.log(wildcard);
                var content = ""
                if(transformToPinYin(answer)==transformToPinYin(wildcard)){
                    content = "回答正确，答案是"+answer;
                }else{
                    content = "回答错误，答案是"+answer;
                }
                document.getElementById("content").innerText=content;
                say(content,6000);
            }else{
                $.get("http://api.tianapi.com/cityriddle/index?key=94b1ce35f4803078d9f8afc89825f03c",function(data){
                    console.log(data);    
                    var response = data.newslist[0];
                    var content = response.quest;
                    answer = response.result;
                    say(content,5000);
                })
            }
            
        }
    },
    {
        smart:true,
        indexes: ['*天气'],
        action: (i,wildcard) => {
            changeMode("查询天气模式")
            $.get("https://api.seniverse.com/v3/weather/now.json?key=S_ud5ewwKE8dTkOH_&location="+wildcard+"&language=zh-Hans&unit=c",function(data){
                var weather = data.results[0].now.text;
                var temperature = data.results[0].now.temperature;
                var content = wildcard+"今天是"+weather+"，气温是"+temperature+"摄氏度"
                say(content,6000);
                var innerHtml = "<h4>"+wildcard+" 天气："+weather+",气温："+temperature+"℃</h4>"
                document.getElementById("content").innerHTML=innerHtml
            });
        }
    },
    // 精美文案
    {
        smart:true,
        indexes: ['精美文案*'],
        action:(i,wildcard) => {
            $.get("http://api.tianapi.com/pyqwenan/index?key=f808a5446c7304744dcfdc4fbc868a87",function(data){
                var content = data.newslist[0].content;
                artyom.say(content);
                var innerHtml = "<h4>" + content + "</h4>"
                document.getElementById("content").innerHTML=innerHtml
            });
        }
    },
    // 搜索
    {
        smart: true,
        indexes: ['百度搜索*'],
        action:(i,wildcard) => {
           window.open("https://www.baidu.com/s?ie=UTF-8&wd="+wildcard,"_blank")
        }
    },
    {
        smart: true,
        indexes: ['谷歌搜索*'],
        action:(i,wildcard) => {
            window.open("https://www.google.com/search?q="+wildcard,"_blank")
        }
    },
    // 控制滚轮
    {
        smart: true,
        indexes: ['向下*'],
        action:(i,wildcard) => {
            document.documentElement.scrollTop+=100
            console.log(document.documentElement.scrollTop)
        }
    },
    {
        smart: true,
        indexes: ['向上*'],
        action:(i,wildcard) => {
            document.documentElement.scrollTop-=100
            console.log(document.documentElement.scrollTop)
        }
    },
    {
        indexes: ['Repeat after me*'],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("You've said : "+ wildcard);
        }
    },
    {
        indexes: ['成语接龙*'],
        smart:true,
        action: (i,wildcard) => {
            changeMode("成语接龙模式")
            $.get("http://api.tianapi.com/chengyujielong/index?key=94b1ce35f4803078d9f8afc89825f03c&word="+wildcard+"&userid=98105401289c18d858c169578ecf0125&statetime=3600",function(data){
                console.log(data);    
                var response = data.newslist[0]   
                var chengyu = response.chengyu //成语
                var jieshi = response.jieshi //解释
                var chuchu = response.chuchu //出处
                var endstr = response.endstr //末尾字符
                var grade = parseInt(response.grade) //积分
                var result = parseInt(response.result) //胜负结果，0为开局、1为胜、2-4都是负、5为赢局（2-5都会退出游戏）
                var tip = response.tip
                if(result==0||result ==1){
                    var content = chengyu+",请继续" 
                    say(content,5000);
                    innerHtml = "<h4>"+chengyu+",积分："+grade+"</h4><h4>"+jieshi+"</h4>"
                    document.getElementById("content").innerHTML=innerHtml
                }else{
                    document.getElementById("content").innerHTML="<div>"+tip+"</div>";
                }
            });
        }
    },
    // The smart commands support regular expressions
    {
        indexes: ['Good Morning*'],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("Good morning: "+ wildcard);
        }
    },
    {
        indexes: ['Good Afternoon*'],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("Good Afternoon: "+ wildcard);
        }
    },
    {
        indexes: ['Good Evening*'],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("Good Evening: "+ wildcard);
        }
    },
    {
        indexes: ['shut down yourself'],
        action: (i,wildcard) => {
            artyom.say("Artyom succesfully stopped")
            artyom.fatality().then(() => {
                console.log("Artyom succesfully stopped");
            });
        }
    },
    {
        smart: true,
        indexes: ['播放音乐*'],
        action: (i, wildcard) => {
            changeMode("音乐播放模式")
            document.getElementById("content").innerText = "正在播放: Nocturne in B Major, Op.9 No.3";
            console.log("开始播放");

            var audio = document.getElementById("audio_");
            audio.play();
        }
    },
    {
        smart: true,
        indexes: ['暂停音乐*',"暂停播放*"],
        action: (i, wildcard) => {
            changeMode(" ")
            console.log("已暂停播放");
            var audio = document.getElementById("audio_");
            audio.pause();
        }
    },
    {
        smart: true,
        indexes: ['停止音乐*', "停止播放*"],
        action: (i, wildcard) => {
            changeMode(" ")
            console.log("已停止播放");
            var audio = document.getElementById("audio_");
            audio.pause();
            audio.load();
        }
    },
    {
        smart:true,
        indexes:['*'],
        action:(i,wildcard)=>{
            changeMode(" ")
            document.getElementById("content").innerText="您说了："+wildcard;
        }
    },

]);

artyom.initialize({
    lang: "zh-CN", // GreatBritain english
    debug: true, // Show messages in the console
    continuous: true, // Listen forever
    //soundex: true,// Use the soundex algorithm to increase accuracy
    //executionKeyword: "and do it now",
    listen: true, // Start to listen commands !
   
}).then(() => {
    console.log("Artyom has been succesfully initialized");
}).catch((err) => {
    console.error("Artyom couldn't be initialized: ", err);
});