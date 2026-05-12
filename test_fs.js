const fs = require('fs');
const path = require('path');

console.log("Running simple test...");
try {
    const file = path.join(__dirname, 'test_out.txt');
    fs.writeFileSync(file, 'Hello World');
    console.log("File written to", file);
} catch (e) {
    console.error("Error:", e.message);
}
