"use strict";
let amount = 1234; // example amount to be broken into denominations

let denominations = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
console.log("Amount to be broken into denominations: " + amount);
for (let d = 0; d < denominations.length; d++) {
    let numberofDen = Math.floor(amount / denominations[d])
    if (numberofDen != 0) {
        console.log( denominations[d] + " * " + numberofDen+ " = " + (denominations[d] * numberofDen))

        amount = amount % denominations[d]
    }
}

//Logic
7777%2000
// math.floor, % 1777

// amount = amount%denominations[1]

// let numberof5hDen = Math.floor(amount/denominations[1])
// console.log("number of 500:"+numberof5hDen)
// if(numberof5hDen!=0){
//    amount = amount%denominations[1]
// }

// let numberof2hDen = Math.floor(amount/denominations[2])
// console.log("number of 200:"+numberof2hDen)
// if(numberof2hDen!=0){
//    amount = amount%denominations[2]
// }
