
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
        indexes: [/Good Morning/i],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("You've said : "+ wildcard);
        }
    },
    
    {
        smart:true,
        indexes:['*'],
        action:(i,wildcard)=>{
            changeMode(" ")
            document.getElementById("content").innerText="您说了："+wildcard;
        }
    }
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