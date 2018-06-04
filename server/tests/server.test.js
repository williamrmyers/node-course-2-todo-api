const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');


const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID,
  text: 'First test to do.'
}, {
  _id: new ObjectID,
  text: 'Second test to do.',
  completed: true,
  completedAt:333
}];


// Testing Lifecycle Method

beforeEach((done)=>{
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then( () => done());
});


describe('POST Todos', ()=>{
  it('Should create a new To DO.', (done)=>{
    var text = 'Test to do';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text)
      })
      .end((err, res)=>{
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done()
        }).catch((e) => done(e));
      });
  })
  it('Should should not create a to do with invalid body data.', (done) => {

    request(app)
     .post('/todos')
     .send({})
     .expect(400)
     .end((err, res)=>{

       if (err) {
         return done(err);
       }
       Todo.find().then((todos)=>{
         expect(todos.length).toBe(2);
         done()
       }).catch((e) => done(e));
     })
  });
});


describe('Get todos route', () => {
  it('Should get all to dos.', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done)
  });
});


describe('GET /todos/:id', () => {
  it('Shoud return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);

  });


  it(`Should should return 404 if todo not found`, (done) => {
    request(app)
      .get(`/todos/${ObjectID('5b0ccae260997123784c4f16').toHexString()}`)
      .expect(404)
      .end(done);
  });

  it(`Should return 404 for non-object IDs.`, (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe(`DELETE /todos/:id`, () => {
  it('should remove to do', (done) => {
    let hexid = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexid}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexid);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexid).then((todo)=>{
          expect(todo).toNotExist();
          done()
        }).catch((e) => done(e));
      })
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should retunr 404 if OBJECT ID is invalid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe(`Patch /todos/:id`, () => {
  it('Should update our to do', (done) => {

    let hexid = todos[0]._id.toHexString();
    let text = `Updated Text!`;

    request(app)
      .patch(`/todos/${hexid}`)
      .send({
        completed: true,
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);



  });
  it('Should clear completed at, when todo is not completed.', (done) => {
    let hexid = todos[1]._id.toHexString();
    let text = `Updated Text!!!!!!`;

    request(app)
      .patch(`/todos/${hexid}`)
      .send({
        completed: false,
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
