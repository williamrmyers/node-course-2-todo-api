// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

const prettyPrint = message => console.log(JSON.stringify(message, undefined, 2));


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if (err) {
    return console.log(`Unable to connect to DB.`);
  }
  console.log(`Connected to Mongo server`);

  // db.collection('Todos').find().count().then((count)=>{
  //   console.log('Todos Count', count);
  //   prettyPrint(docs);
  // }), (err)=>{
  //   console.log('Unable to fetch data', err);
  // };

  db.collection('Users').find({name: 'William'}).toArray().then((data)=>{
    prettyPrint(data);
  }, () => {
    console.log(`Error reading DB.`);
  });

  // db.close();
});
