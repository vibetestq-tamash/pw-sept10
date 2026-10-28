
function getFirstElement<T>(arg: T[]): T {
    return arg[0];
}

console.log(getFirstElement<string>(["apple", "banana", "cherry"])); // String Array
console.log(getFirstElement<number>([1, 2, 3])); // Number Array

// String Array
// Number Array

// This is called generics in TypeScript
// Generics allow you to create reusable components that work with any data type.