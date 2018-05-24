// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

const prettyPrint = message => console.log(JSON.stringify(message, undefined, 2));


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if (err) {
    return console.log(`Unable to connect to DB.`);
  }
  console.log(`Connected to Mongo server`);

  // db.collection('Todos').deleteMany({ text: 'Eat Lunch'}).then((result)=>{
  //   console.log(result);
  // }) ;

  // db.collection('Todos').deleteOne({text:"Eat Lunch"}).then((result)=>{
  //   console.log(result);
  // });
  // deleteOne
  // db.collection('Todos').findOneAndDelete({ completed: true }).then((result)=>{
  //   console.log(result);
  // });

  // Challenge
  db.collection('Users').findOneAndDelete({ _id: new ObjectID("5b05ce1980c9c2166fe1ea44")}).then((result)=>{
    console.log(result);
  });


  // db.close();
});
