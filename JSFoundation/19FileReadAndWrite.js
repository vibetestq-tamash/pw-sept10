const fs = require('fs');

// Read file
const data = fs.readFileSync('files/demo.txt', 'utf-8');
console.log(data);

// Write file
const outputData = "This is some sample text to write to the file.";
fs.writeFileSync('files/out.txt', outputData, 'utf-8');
console.log("Data written to file successfully.");