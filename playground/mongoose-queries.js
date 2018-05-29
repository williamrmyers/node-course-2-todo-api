const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


let id = '55b0ccae260997123784c4f11';

// if (!ObjectID.isValid(id)) {
//   console.log(`ID not valid`);
// }


// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log(`Todos`, todos);
// });
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log(`Todo`, todo);
// });


// Todo.findById(id).then( (todo) => {
//   if (!todo) {
//     return console.log(`ID not found`);
//   }
//   console.log('Found by Id' ,todo);
// }).catch( (e)=>{console.log(e);} )


// Get user by ID

const userID = '5b0a072c033986244a5a89c9';

User.findById(userID).then((user) => {
  console.log({'User': user});
}, (e) => {
  return console.log(`There was an error finding users`, e);
})
