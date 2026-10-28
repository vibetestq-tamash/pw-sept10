// Index based for loop
let numbers = [1, 2, 3, 4, 5];
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

// For-of loop
for (let n of numbers) {
    console.log(n);
}

let users = ["Alice", "Bob", "Charlie"];
for (let user of users) {
    console.log(user);
}

let userData = {
    Bhuvan: { age: 25, city: "New York" },
    Anita: { age: 30, city: "Los Angeles" },
    Jyothi: { age: 35, city: "Chicago" }
};

for (let user in userData) {
    console.log(user, userData[user]["age"]);
}

//for each loop
users.forEach(function(user) {
    if (user.startsWith("A")) {
        console.log(user);
    }
});

for (let i = 0; i < users.length; i++) {
        if (users[i].startsWith("A")) {
        console.log(users[i]);
    }
}

// Object.keys(userData).forEach(function(user) {
//     if (user.startsWith("A")) {
//         console.log(user);
//     }
// });

