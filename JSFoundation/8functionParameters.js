//rest parameter: accept any number of values and convert to an array

function AddAllNumbers(...numbers) {

    let sum = 0;
    console.log(numbers)
    for (let i = 0; i < numbers.length; i++) {
        sum = sum + numbers[i]
        
    }
    console.log(sum)
}

AddAllNumbers(1, 3, 4, 2, 6, 7)

let x= [10,20,30];
AddAllNumbers(...x) // Spread Parameter
// Spreads Array values like individual values


// Return Odd numbers between 10 and 30

function getOddNumbers(rStart=10,rEnd=30){
    // rStart and rEnd are default parameter values
    let oddNumArr = [];

    for(let n=rStart;n<=rEnd;n++){
        if(n%2==1){
            oddNumArr.push(n);      
        }
    }

    return oddNumArr;
}

let oddNumbers = getOddNumbers()
console.log(oddNumbers)