// while loop
// Execute block of code as long as the condition is true
// if condition fail, the loop will not execute

// syntax:
// initialization
// while(condition){
//     // code to be executed
//     // increment/decrement
// }

// example: print numbers from 1 to 5

// While executes 0 or more times depending on the condition

let i = 1; // initialization
while(i <= 5){ // condition
    console.log(i); // code to be executed
    i++; // increment
}

// Do executes 1 or more times depending on the condition
do {
    console.log(i); // code to be executed
    i++; // increment
} while(i <= 5); // condition