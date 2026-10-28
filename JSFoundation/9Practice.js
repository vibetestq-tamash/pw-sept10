function getFactors(n){
    
    //(n/2)+1 to n-1 will not be factors except n itself
    // thats why we only need to check up to n/2
    let factors = [];
    for(let i = 1; i <= n/2; i++){
        if(n % i === 0){
            factors.push(i);
        }
    }
    factors.push(n);
    return factors;
}

console.log(getFactors(100));

function getFactorial(n){

    let result = n;
    for(let i = n - 1; i >= 1; i--){
        result = result * i;
    }
    return result;
}

console.log(getFactorial(5));