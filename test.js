let str = "";
let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
for(let i = 1; i <= 32; i++){
	let random = Math.floor(Math.random()*arr.length);
	str += arr[random];
}
console.log(str);
