const fs = require('fs');
const path = require('path');

let hello = fs.readFileSync(path.join(__dirname, '../sshKey/应用私钥2048.txt'), 'ascii');
console.log(hello);
