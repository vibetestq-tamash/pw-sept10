// for loop
// Execute block of for specific number of times

// Print 5 for 5 times

// counter
// starting and ending values of the counter

// initialization of the counter
// condition to check before each iteration
// increment or decrement of the counter

// for(initialization; condition; increment/decrement)
// initialization: executed once before the loop starts
// condition: checked before each iteration, if true loop continues, if false loop stops
// increment/decrement: executed after each iteration

for(let i=10; i<=14;i++){ // i++ = i=i+1
    console.log(5);
}

// print numbers from 1 to 10
for(let i=1; i<=10; i++){
    console.log(i);
}

// print numbers from 10 to 1
for(let i=10; i>=1; i--){ // i-- = i=i-1
    console.log(i);
}

// print even numbers from 1 to 10
for(let i=2; i<=10; i+=2){ // i+=2 = i=i+2
    console.log(i);
}

// print odd numbers from 1 to 10
for(let i=1; i<=10; i+=2){ // i+=2 = i=i+2
    console.log(i);
}

// print odd number between 10 and 20
for(let i=11; i<=20; i++){ // i+=2 = i=i+2
    if(i % 2 == 1){
        console.log(i);
    }
}