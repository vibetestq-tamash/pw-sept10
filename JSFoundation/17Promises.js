// Promises
// 3 States
// 1. Pending : Promise is still running
// 2. Fulfilled : Promise has successfully completed
// 3. Rejected : Promise has failed

// await will wait for promise to settle
// either resolve or reject

// syntax of a promise
// const promise = new Promise((resolve, reject) => {
//     // asynchronous operation
//     if (/* operation successful */) {
//         resolve(result);
//     } else {
//         reject(error);
//     }
// });

// let p = new Promise((resolve, reject)=>{

//     // Both resolve and reject are call back functions provided by the Promise constructor
//     // Example usage:
//     let success = false; // Simulate an operation
//     if (success) {
//         resolve("Operation was successful");
//     } else {
//         reject("Operation failed");
//     }
// });

// p.then((message) => {
//     console.log("Success: " + message);
// }).catch((error) => {
//     console.log("Error: " + error);
//     throw new Error(error); //Error is a constructor for creating error objects
// });

function enterUserName() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let isUserNameEntered = true; // Simulate user name entry success
            console.log("user name is entered")
            if (isUserNameEntered) {
                resolve();
            } else {
                reject("User name entry failed");
            }
        }, 2000)
    });
}

function enterPassword() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let isPasswordEntered = true; // Simulate password entry success
            console.log("Password is entered")
            if (isPasswordEntered) {
                resolve();
            } else {
                reject("Password entry failed");
            }
        }, 1000)
    });
}

function clickLoginButton() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let isLoginButtonClicked = true; // Simulate login button click success
            console.log("Login button clicked")
            if (isLoginButtonClicked) {
                resolve("session123");
            } else {
                reject("Login button click failed");
            }
        }, 1000)
    });
}

// enterUserName().then(() => {
//     return enterPassword();
// }).then(() => {
//     return clickLoginButton();
// }).then((sessionId) => {
//     console.log("Login successful, session ID: " + sessionId);
// }).catch((error) => {
//     console.log("Error: " + error);
//     throw new Error(error); //Error is a constructor for creating error objects
// });

// With we landed into Callback Hell, 
// Promises help us avoid that by chaining.then() calls instead of nesting callbacks.
// This is still complex
// What if there are 100 steps to perform sequentially?
// Chaining .then() calls for so many steps would become very cumbersome and hard to manage.
// This is where async/await syntax can make the code more readable and maintainable.

// in ES2017, async/await syntax was introduced to handle asynchronous operations more elegantly.
// It allows us to write asynchronous code that looks synchronous, making it easier to read and maintain.

// async and await is the combination to be used for handling asynchronous
// Write function that starts with async
// use await before each promise call
// it will automatically wait promise to complete
// If promise is pending, await will wait for promise to resolve or reject
//      before moving to the next line.
// All playwright actions return promises.
// We just need to use await before each playwright action

// A function that is defined with async and any valid await availble then it returns promise

async function login() {
    await enterUserName();
    await enterPassword();
    await console.log("hello")
    const sessionId = await clickLoginButton();
    console.log("Login successful, session ID: " + sessionId);
}

login().catch((error) => {
    console.log("Error: " + error);
    throw new Error(error); //Error is a constructor for creating error objects
});