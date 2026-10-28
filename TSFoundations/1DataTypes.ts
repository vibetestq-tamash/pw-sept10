// Syntax for types
// let variable: type=value
let age: number = 25;
let userName: string = "John";
let isStudent: boolean = true;
// age = "30"; // Error: Type 'string' is not assignable to type 'number'

// npm i typescript
// We can use tsc for converting ts to js file
// Example: npx tsc 1DataTypes.ts

// Array
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let isActive: boolean[] = [true, false, true];

// Array with multiple types
let mixedArray: (number | string)[] = [1, "Alice", "true"];
// this is called a union type array

// Tuple
let person: [string, number, boolean] = ["Alice", 25, true];
// Tuple is an array with fixed number of elements and types in a specific order

// function sample

function demoAdd(a: number, b: number): number {
    return (a + b);
}

// demoAdd()

// Example usage of the function
let result: number = demoAdd(5, 10);
console.log(result);

// type for objects

//custom type
type User = {
    name: string;
    age: number;
    isStudent: boolean;
};

let userData: User ={
    name: "John",
    age: 25,
    isStudent: true,
    // Error: Property 'college' does not exist on type 'User'
    // college: "XYZ University"
}

type cred={
    userName: string;
    password: string;
    otp?:number // ? defines an optional property
}

let adminCreds: cred = {
    userName: "JohnDoe",
    password: "12345",
    
};

let guestCreds: cred = {
    userName: "JohnDoe",
    password: "12345"
};

Login(adminCreds);
Login(guestCreds);

function Login(creds: cred){
    console.log("userName: " + creds.userName);
    console.log("password: " + creds.password);
    console.log("otp: " + creds.otp);
}


// let adminCreds= {
//     userName: "JohnDoe",
//     password: "12345"
// };

// let guestCreds= {
//     userName: "JohnDoe",
//     password: "12345"
// };

// Login(adminCreds.userName, adminCreds.password);
// Login(guestCreds.userName, guestCreds.password);

// function Login(userName: string, password: string){
//     console.log("userName: " + userName);
//     console.log("password: " + password);
// }


// ts 7 : GO language used for conversion from ts to js
