// By default variable declaration is not required
// Its a standard programming practice
// let is used to declare block-scoped variables
// "use strict" enforce you to declare variables before using them

"use strict";

let x = 10;let y = 20;

let sudhakar = "Hello";
console.log(sudhakar);

console.log(x + y);

let isExist = true; // boolean

let z; //undefined

let n = null; // null

let data = [10, 20, 30]; // object (array)
console.log(data[0]);
console.log(data[1]);

console.log("typeof x: " + typeof x);
console.log("typeof sudhakar: " + typeof sudhakar);
console.log("typeof isExist: " + typeof isExist);
console.log("typeof z: " + typeof z);
console.log("typeof n: " + typeof n);
console.log("typeof data: " + typeof data);

let userData = { username: "sudhakar", userId: 12345 };

console.log(userData.username);
console.log(userData.userId);
console.log("typeof userData: " + typeof userData);

// Assignable types: Number, String, boolean, array, object

//JSON: JavaScript Object Notation

let employeeData = {
    "employeeName": "John Doe", 
    employeeId: 67890,
    employeeTech: ["JavaScript", "Python", "Java"],
    employeeAddress: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345",
    }
};

let employeeName = 'Sekhar';

console.log(employeeData.employeeName);
console.log(employeeData["employeeName"]);

console.log(employeeData.employeeId);
console.log(employeeData.employeeTech);
console.log("typeof employeeData: " + typeof employeeData);



// Types of data

// Number
// Character / String
// Boolean
// Undefined
// Null
// Object


// ( ) : Function (used to define and invoke functions)
// { } : Objects and Block of code (used to group statements)
// [ ] : Arrays (used to store multiple values in a single variable)
// " " : Strings (used to represent text)
// ' ' : We can use both single and double quotes for strings
// `;` : Statement terminator (used to end a statement)
// :   : Key-value separator in objects (used to assign values to keys)
// ,   : Item separator in arrays and objects (used to separate multiple values)
// // : Single-line comment (used to add comments in the code)
// /* */ : Multi-line comment (used to add comments spanning multiple lines)

/* this is 
multi 
line 
comment 
*/