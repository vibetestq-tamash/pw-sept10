// functions hoisted

//create addition function

let a = 10;
let b = 20;
demoadd(a, b)

// function function_name(inputParameters) { }
// function function_name(inputParameters) { return value;}
// return is the last executable statement in function

function demoadd(x, y) {
    console.log(x + y)
}

console.log(isOdd())
function isOdd(n=15) { // default parameter value is 15
    if (n % 2 == 1) {
        return true;
    }
    else {
        return false;
    }
}

console.log("finding 10 is odd: " + isOdd(10))

function printTable(n) {
    for (let i = 1; i <= 10; i++) {
        console.log(n + "*" + i + "=" + (n * i))
    }
    //2*1=2
}

printTable(2)
printTable(5)
printTable(10)
// printTable()