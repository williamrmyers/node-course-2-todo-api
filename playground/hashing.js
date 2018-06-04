const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
  id: 10
}

let token = jwt.sign(data, '123abc');

console.log(token);


let decoded = jwt.verify(token, '123abc')

console.log(decoded);



//
// let message = 'I am user number 3.';
//
// let hash = SHA256(message).toString();
//
// let data = {
//   id: 4
// }
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'This is a salt!').toString()
// }
//
//
// token.data = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
//
//
// console.log(token);
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'This is a salt!').toString();
//
// if (resultHash == token.hash) {
//   console.log('Data was not changed. ');
// } else {
//   console.log('Data was changed. ');
// }