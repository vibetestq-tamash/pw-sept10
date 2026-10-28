demo();

function demo(){
    console.log("Demo function called");
}

demo();

// demo is a named function
// it can be called before its declaration due to hoisting

let demoAnonymous = function(){
    console.log("Demo anonymous function called");
};

demoAnonymous();

// demoAnonymous is an anonymous function
// it cannot be called before its declaration due to lack of hoisting

function calculator(a, b,operation){
    return operation(a, b); // calling the passed function with arguments a and b
    // this is callback function pattern
}

// Example usage of calculator function
let sum =calculator(5, 3, function (x, y){ // passing function as an argument
    return x + y;
});

console.log("Sum:", sum);

let mul =calculator(5, 3, function(x, y){ // passing function as an argument
    return x * y;
});
console.log("Multiplication:", mul);

let sumArrow = calculator(10,20,(a,b)=> a + b); // passing arrow function as an argument
console.log("Sum using arrow function:", sumArrow);