// if condition

//find odd number
// + : addition
// - : subtraction
// * : multiplication
// / : division
// % : modulus (remainder)
// == : equality comparison
// === : strict equality comparison
// != : inequality comparison
// !== : strict inequality comparison
// > : greater than
// < : less than
// >= : greater than or equal to
// <= : less than or equal to


//if condition : This or that 

let n = 11;

if (n % 2 == 1) {
    console.log(n + " is odd");
}
else {
    console.log(n + " is even");
}

// find big number between two numbers

let a = 10;
let b = 10;

if (a > b) {
    console.log("a is bigger");
}
else if (a < b) {
    console.log("b is bigger");
}
else {
    console.log("a and b are equal");
}

// switch case

// Switch executes matching case to break
// Choosing one from many

let day = 3;

switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    case 4:
        console.log("Thursday");
        break;
    case 5:
        console.log("Friday");
        break;
    case 6:
        console.log("Saturday");
        break;
    case 7:
        console.log("Sunday");
        break;
    default:
        console.log("Invalid day");
        break;
}

// ternary operator

let num = 11;
console.log((num % 2 == 1))

let result = num % 2 == 1 ? "odd" : "even";

// condition ? trueValue : falseValue
