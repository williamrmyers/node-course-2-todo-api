const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((result)=>{
//   console.log(result);
// });


Todo.findByIdAndRemove('5b0ddf1dd1e5ff08e16502f3').then((todo) => {
  console.log(todo);
})
