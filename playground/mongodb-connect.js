// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if (err) {
    return console.log(`Unable to connect to DB.`);
  }
  console.log(`Connected to Mongo server`);

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // },(err, result)=>{
  //   if (err) {
  //       return console.log(`Unable to insert To DO.`, err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // insert new docs to users
  // (name, age, location)

  db.collection('Users').insertOne({
    name: 'William',
    age: '30',
    location: 'Oakland'

  }, (err, result)=>{
      if (err) {
        return console.log(`Write Error`, err);
      }
    // console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });
  db.close();
});
