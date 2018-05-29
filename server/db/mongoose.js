const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://williamrmyers:12345@ds239930.mlab.com:39930/todoapp'
};

mongoose.connect(db.mlab || db.localhost);

module.exports = { mongoose };
