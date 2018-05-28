// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

const prettyPrint = message => console.log(JSON.stringify(message, undefined, 2));


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if (err) {
    return console.log(`Unable to connect to DB.`);
  }
  console.log(`Connected to Mongo server`);

  // db.collection('Todos').findOneAndUpdate({
  //     _id: new ObjectID('5b0730824e21c2ff93fa0ba8')
  //   },
  //   {
  //     $set: { completed: true }
  //   }, {
  //     returnOriginal: false
  //   }).then(
  //     (result)=>{
  //   console.log(result);
  // });

// Challenge

db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b05da179151ea1e2ef3ba42')
  },
  {
    $set: {
      name: 'Super William'
    },
    $inc: {
        age: 1
    }
  }, {
    returnOriginal: false
  }).then(
    (result)=>{
  console.log(result);
});


// db.collection('Users').findOneAndUpdate({
//   _id: new ObjectID('5b05da179151ea1e2ef3ba42')
// }, {
//   $set: {
//     name: 'Andrew'
//   },
//   $inc: {
//     age: 1
//   }
// }, {
//   returnOriginal: false
// }).then((result) => {
//   console.log(result);
// });


  // db.close();
});
