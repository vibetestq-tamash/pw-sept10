// Asynchronous programming in JavaScript

// for Test Automation Synchronous is Mandatory

// Callback is first solution to make JS test to behave asynchronous to synchronous

function enterUserName(cb,cb1){
    setTimeout(()=>{
           console.log("user name is entered")
           cb(cb1);
    },2000)
 
}

function enterPassword(cb){
    setTimeout(()=>{
            console.log("Password is entered")
            cb();
    },1000)
}

function clickLoginButton(){
    setTimeout(()=>{
            console.log("Login button clicked")
    },1000)
}

enterUserName(enterPassword,clickLoginButton)
//Callback hell

// function calling back another function calling back another function calling back another function 

// Promises are the next solution to avoid callback hell
