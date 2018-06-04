const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

let db = {
  localhost: process.env.MONGODB_URI
  // mlab: 'mongodb://williamrmyers:12345@ds239930.mlab.com:39930/todoapp'
};

mongoose.connect(db.localhost || db.mlab);

module.exports = { mongoose };
