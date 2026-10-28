// Arrow functions in JavaScript

// Arrow functions are short form for writing functions
// Its like how we have ternary operator for short if-else statements

// ()=> {}
// () is optional if there is exactly one parameter
// {} is optional if the function body has only one statement

let demo = () => {
    console.log("This is a demo arrow function");
};

demo();

// Write arrow function for addition
let add = (a, b) => {
    return a + b
};

console.log(add(5, 3));

let add1 = (a, b) => a + b;

let d = () => {
    console.log("demo arrow function")
}

// arrow function for square

let sq = x => x * x;
console.log(sq(2))

function Calculator(a, b, operation) {
    return operation(a, b)
}

console.log(Calculator(10, 20, (x, y) => x * y))

let data = [10, 20, 30];

data.forEach((x) => console.log(x));

setTimeout( ()=>console.log("This is a setTimeout demo") , 2000);
setTimeout(function() {
    console.log("This is a setTimeout demo using function expression");
}, 2000);
