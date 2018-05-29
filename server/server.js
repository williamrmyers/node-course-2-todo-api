const express = require('express');
const bodyParser = require('body-parser');


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



app.listen(3000, ()=>{
  console.log(`App started on port 3000`);
});

module.exports = {app};
