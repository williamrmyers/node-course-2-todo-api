const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


let {mongoose} = require('./db/mongoose');

let {Todo} =require('./models/todo');
let {User} =require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  let todo = new Todo({
    text:req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    console.log(`There was an error`, e);
    res.status(400).send(e);
  });
});



// Get To todos Route

app.get('/todos', (req, res) => {
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e) => {
    console.log(`Opps there was an error`, e);
    res.status(400).send(e);
  });
});


// Get Specifc ID route.

app.get('/todos/:id', (req, res) => {

  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send({});
  }

  Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send({});
    }
    // Success case
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(404).send();
  });
});


app.listen(3000, ()=>{
  console.log(`App started on port 3000`);
});

module.exports = {app};
