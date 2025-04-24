const mongoose = require('mongoose');
const request = require("supertest");  
const app = require('../app.js'); 

// services required to automate tests and minimise hard-coding
const authService = require('../services/auth.service');
const userService = require('../services/user.services');
                              
// Connecting to mongoDB before each test
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => console.log("Connection to MongoDB established for Jest."),
    err => console.log("Failed to connect to MongoDB for Jest ", err)
  );
});

// Close connection to MongoDB after each test
afterEach(async () => {
  await mongoose.connection.close();
})


describe("Requests for /api/users", () => {    

  let token;

  beforeAll(() => {
    user = {                  
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITOR", "READER", "ADMIN"]
    };
    token = authService.generateAccessToken(user);
  });

  // GET
  it('GET Returns all users', async () => {  
    const res = await request(app) 
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);       
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  }, 10000);    


  it('POST Create a user', async() => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({   // to body tou POST
        'username': 'test5',
        'username': 'sur5',
        'password': '12345',
        'name': 'user5',
        'email': 'test5@aueb.gr',
        'address': {
          'area': 'area5',
          'road': 'road5'
        }
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  }, 50000);


  it('POST Create a user that exists already', async() => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        'username': 'test5',
        'username': 'sur5',
        'password': '12345',
        'name': 'user5',
        'email': 'test5@aueb.gr',
        'address': {
          'area': 'area5',
          'road': 'road5'
          }
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBeFalsy();
  }, 50000);


  it('POST Create a user with the same email', async() => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        'username': 'anotherTest5',
        'username': 'anothersur5',
        'password': '12345',
        'name': 'anotheruser5',
        'email': 'test5@aueb.gr',
        'address': {
          'area': 'area5',
          'road': 'road5'
          }
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBeFalsy();
  }, 50000);


  it('POST Create user with empty name, surname, password', async() => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        'username': 'testempty',
          'username': '',
          'password': '',
          'name': '',
          'email': 'testempty@aueb.gr',
          'address': {
            'area': 'area5',
            'road': 'road5'
            }
      })
  
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBeFalsy();
  })

});



describe("Requests for /api/users/:username", () => {
  let token;

  beforeAll(() => {
    user = {                  // Ftiaxnoume emeis me to xeri enan user gia to teting. Gia na parei access token
      username: "admin",
      email: "admin@aueb.gr",
      roles: ["EDITOR", "READER", "ADMIN"]
    };
    token = authService.generateAccessToken(user);
  }); 

  it("GET Returns specific user", async() => {

    const result = await userService.findLastInsertedUser();

    const res = await request(app)
      .get('/api/users/' + result.username)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data[0].username).toBe(result.username);
    expect(res.body.data[0].email).toBe(result.email);
  });


  it('UPDATE a user', async() => {
    const result = await userService.findLastInsertedUser();

    const res = await request(app)
      .patch('/api/users/' + result.username)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: result.username,
        name: 'newupdatedname',
        surname: 'newupdatedsurname',
        email: 'newemail@aueb.gr',
        address: {
          'area': 'area5',
          'road': 'road5'
        }
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBeTruthy();
  });


  it('DELETE a user', async() => {
    const result = await userService.findLastInsertedUser();

    const res = await request(app)
      .delete('/api/users/' + result.username)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
  })
});