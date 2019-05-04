const cron = require("node-cron");
const express = require("express");
const fs = require("fs");

app = express();

cron.schedule("* * * * *",function(){
    console.log("running a task every minute");
});

var x = `cron.schedule("* * * * *",function(){
    console.log("running a task every minute");
});`


fs.appendFile("./jobs.js",x,function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

app.listen(3000);