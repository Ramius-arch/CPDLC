const request = require('supertest');
const app = require('../../src/backend/app'); // Adjust path to your app entry point

describe('Model API Tests', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        role: 'pilot'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  it('should not allow duplicate usernames', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser2',
        password: 'testpassword',
        role: 'controller'
      });
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser2',
        password: 'testpassword',
        role: 'controller'
      });
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  // Add more tests for other models and endpoints as needed
});