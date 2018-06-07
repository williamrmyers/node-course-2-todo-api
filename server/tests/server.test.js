const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');


const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// Testing Lifecycle Method
beforeEach(populateUsers);
beforeEach(populateTodos);


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


describe('GET /users/me', () => {
  it('Should return user if authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated.', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});



describe(`POST to /users`, () => {
  it('should create a user.', (done) => {
    let email = 'example@example.com';
    let password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return end(done);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({ 'email': '122345678qwertyui', 'password': '123'})
      .expect(400)
      .end(done);
  });
  it('should not create user if email in use.', (done) => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: users[0].password})
      .expect(400)
      .end(done);
  });
});


describe(`POST /users/login`, () => {
  it(`should login user and return auth token.`, (done) => {
    request(app)
    .post(`/users/login`)
    .send({ 'email': users[1].email, 'password': users[1].password })
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth']).toExist() ;
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById( users[1]._id ).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.header['x-auth']
        });
        done()
      }).catch((e) => done(e));
    })
  });

  it(`should reject invalid login`, (done) => {
    request(app)
      .post(`/users/login`)
      .send({ 'email': users[1].email, 'password': '12345'})
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toNotExist() ;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById( users[1]._id ).then((user) => {
          expect(user.tokens.length).toBe(0);
          done()
        }).catch((e) => done(e));
      })
    });
});




describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout.', (done) => {
    request(app)
      .delete(`/users/me/token`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById( users[0]._id ).then((user) => {
          expect(user.tokens.length).toBe(0);
          done()
        }).catch((e) => done(e));
      });
  });
});
