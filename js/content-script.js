var artyom = new Artyom();


document.getElementById("test").addEventListener("click",function(){
    $.get("https://api.seniverse.com/v3/weather/now.json?key=S_ud5ewwKE8dTkOH_&location=上海&language=zh-Hans&unit=c",function(data){
        var weather = data.results[0].now.text;
        var temperature = data.results[0].now.temperature;
        var content = "今天的天气是"+weather+"，气温是"+temperature+"摄氏度"
        artyom.say(content); 
    })
},false);

artyom.addCommands([
    {
        smart:true,
        indexes: ['*天气'],
        action: (i,wildcard) => {
            document.getElementById("test").innerText=wildcard
            $.get("https://api.seniverse.com/v3/weather/now.json?key=S_ud5ewwKE8dTkOH_&location="+wildcard+"&language=zh-Hans&unit=c",function(data){
                var weather = data.results[0].now.text;
                var temperature = data.results[0].now.temperature;
                var content = wildcard+"今天是"+weather+"，气温是"+temperature+"摄氏度"
                artyom.say(content); 
            });
        }
    },
    {
        indexes: ['Repeat after me *'],
        smart:true,
        action: (i,wildcard) => {
            say("You've said : "+ wildcard);
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
        indexes: ['shut down yourself'],
        action: (i,wildcard) => {
            artyom.fatality().then(() => {
                console.log("Artyom succesfully stopped");
            });
        }
    },
]);
artyom.initialize({
    lang: "zh-CN", // GreatBritain english
    continuous: true, // Listen forever
    //soundex: true,// Use the soundex algorithm to increase accuracy
    debug: true, // Show messages in the console
    //executionKeyword: "and do it now",
    listen: true, // Start to listen commands !
   
}).then(() => {
    console.log("Artyom has been succesfully initialized");
}).catch((err) => {
    console.error("Artyom couldn't be initialized: ", err);
});
