const cron = require('node-cron');
cron.schedule("* * * * *",function(){
    console.log("running a task every minute");
});cron.schedule("* * * * *",function(){
    console.log("running a task every minute");
});
