let person = {
    name: "John",
    age: 30,
    city: "New York",
    // this is a keyword that refers to the current object
    getDetails: function () {
        // return `${this.name} is ${this.age} years old and lives in ${this.city}.`;
        // Traditional string concatenation
        return this.name + " is " + this.age + " years old and lives in " + this.city + ".";
    },
    //arrow function
    // arrow functions do not have their own 'this' context, so 'this' refers to the surrounding scope.
    getDetailsArrow: () => {
        return `${this.name} is ${this.age} years old and lives in ${this.city}.`;
    }
};

console.log(person.getDetails());
console.log(person.getDetailsArrow());

// Object Constructor
// In ES 2015 (ES6), classes were introduced as a syntactical sugar over the existing prototype-based inheritance.
// However, the traditional function constructor approach is still valid and widely used.
// Here is an example using the function constructor:

// function Person(name, age, city) {
//     this.name = name;
//     this.age = age;
//     this.city = city;
//     this.getDetails = function() {
//         return this.name + " is " + this.age + " years old and lives in " + this.city + ".";
//     };
// }
export class Person {
    constructor(name, age, city) {
        // Object Properties Initialization
        this.name = name;
        this.age = age;
        this.city = city;
    }

    // Method Definition
    getDetails() { // We call this as method instead function
        return this.name + " is " + this.age + " years old and lives in " + this.city + ".";
    }
}

// new key word used for creating instances of the Person class

export let person2 = new Person("Jane", 25, "Los Angeles");
console.log(person2.getDetails());

export let person3 = new Person("Alice", 28, "Chicago");

export let person4 = new Person("Bob", 32, "Miami");

console.log(person3.getDetails());
console.log(person4.getDetails());

// module.exports = { person, Person, person2, person3, person4 };