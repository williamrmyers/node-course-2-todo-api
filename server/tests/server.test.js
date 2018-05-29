const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');


const {Todo} = require('./../models/todo');

const todos = [{
  text: 'First test to do.'
}, {
  text: 'Second test to do.'
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
