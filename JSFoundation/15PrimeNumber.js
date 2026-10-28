// Prime Number program
// Number which is divisible by only 1 and itself

// let n = 99;

// // var is old and not block scoped
// let isPrime = true
// for(let i=2;i<=n/2;i++){
//     if(n%i==0){
//         console.log(n+" is not a prime number");
//         isPrime = false;
//         break; // Stop loop
//     }
// }

// if(n==1 || isPrime){
//     console.log(n+" is a prime number")
// }

function isPrimeNumber(n) {
    if (n <= 1) {
        console.log(n + " is not a prime number");
        return false;
    }
    for (let i = 2; i <= n / 2; i++) {
        if (n % i == 0) {
            console.log(n + " is not a prime number");
            return false;
        }
    }
    console.log(n + " is a prime number")
    return true;
}

console.log(" isPrimeNumber(-10): " + isPrimeNumber(-10))
console.log(" isPrimeNumber(2): " + isPrimeNumber(2))
console.log(" isPrimeNumber(3): " + isPrimeNumber(3))
console.log(" isPrimeNumber(4): " + isPrimeNumber(4))
console.log(" isPrimeNumber(5): " + isPrimeNumber(5))

console.log(" isPrimeNumber(97): " + isPrimeNumber(97))