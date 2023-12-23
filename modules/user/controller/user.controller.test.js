import request from 'supertest';
import app from '../../../index.js';
import { faker } from '@faker-js/faker';

describe('Testing User APIs', () => {
  let token;
  
  afterAll(() => {
    app.close();
  });

  afterEach(() => {
    app.close();
  });

  const registrationPayload = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: '89G1wJuBLbGziIs',
    confirm_password: "confirm password",
  };

  describe('POST /user/register', () => {
    it('Should throw an error because of password mismatch', async () => {
      request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload)
        .expect(500);
    });

    it('Should throw an error for an invalid email', async () => {
      registrationPayload.confirm_password = registrationPayload.password;
      registrationPayload.email = 'Jobayer@';
      request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload)
        .expect(500);
    });

    it('Should throw an error for first_name length', async () => {
      registrationPayload.email = faker.internet.email();
      registrationPayload.first_name = 'J';
      request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload)
        .expect(500);
    });

    it('Should return successfully created user message', async () => {
      registrationPayload.first_name = faker.person.firstName();
      const response = await request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
    });

    it('Should return email already exists error message', async () => {
      const response = await request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload);
      expect(response.body).toEqual({ error: 'Email already used.' });
    });
  });

  describe('POST /user/login', () => {
    const loginPayload = {
      email: 'Jobayer@',
      password: registrationPayload.password,
    };

    it('Should throw error for invalid email', async () => {
      request(app).post('/user/login').set('Accept', 'application/json').send(loginPayload)
        .expect(401);
    });

    it('Should return JWT token after successfully login', async () => {
      loginPayload.email = registrationPayload.email;
      const response = await request(app).post('/user/login').set('Accept', 'application/json').send(loginPayload);
      token = response.body;
    });
  });

  describe('DELETE /user/remove-account', () => {
    it('Should return Invalid Authorization header', async () => {
      const response = await request(app).delete('/user/remove-account');
      expect(response.body).toEqual({ error: 'Invalid authorization header' });
    });

    it('Should return Invalid Authorization header', async () => {
      const response = await request(app).delete('/user/remove-account').set('Authorization', 'Bearer ');
      expect(response.body).toEqual({ error: 'Invalid authorization header' });
    });

    it('Should return Invalid auth token', async () => {
      const response = await request(app).delete('/user/remove-account').set('Authorization', 'Bearer test');
      expect(response.body).toEqual({ error: 'Invalid auth token' });
    });

    it('Should remove account successfully', async () => {
      const response = await request(app).delete('/user/remove-account').set('Authorization', `Bearer ${token}`);
      expect(response.body).toEqual({ message: 'Account removed successfully' });
    });
  });
});
