import request from 'supertest';
import app from '../../../index.js';

describe('Testing User APIs', () => {
    let token;
    afterEach(() => {
        app.close();
      });

    const registrationPayload = {
        first_name: "Jobayer",
        last_name: "ahmed",
        email: "jobayer@example.com",
        password: "12345",
        confirm_password: "12346",
    }

    describe('POST /user/register', () => {
        it('Should throw an error because of password mismatch', async ()=> {
            request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload).expect(500);
        });

        it('Should throw an error for an invalid email', async () => {
            registrationPayload.confirm_password = '12345';
            registrationPayload.email = 'Jobayer@'
            request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload).expect(500);
        });

        it('Should throw an error for first_name length', async () => {
            registrationPayload.email = 'Jobayer6735@gmail.com';
            registrationPayload.first_name = 'J';
            request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload).expect(500);
        });

        it('Should return successfully created user message', async () => {
            registrationPayload.first_name = 'Jobayer';
            const response = await request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload);
            expect(response.body).toEqual({ message: 'User created successfully'});
        });
        
        it('Should return email already exists error message', async () => {
            const response = await request(app).post('/user/register').set('Accept', 'application/json').send(registrationPayload);
            expect(response.body).toEqual({ error: "Email already used."});
        });
    });

    describe('POST /user/login', () => {
        const loginPayload = {
            email: 'Jobayer@',
            password: '12345'
        }
        
        it('Should throw error for invalid email', async () => {
            request(app).post('/user/login').set('Accept', 'application/json').send(loginPayload).expect(401);
        });

        it('Should return JWT token after successfully login', async ()=> {
            loginPayload.email = 'Jobayer6735@gmail.com';
            const response  = await request(app).post('/user/login').set('Accept', 'application/json').send(loginPayload);
            token = response.body;
        });
    });

    describe('DELETE /user/remove-account', ()=> {
        it('Should return Invalid Authorization header', async() => {
            const response = await request(app).delete('/user/remove-account');
            expect(response.body).toEqual({ error: "Invalid authorization header"});
        });

        it('Should return Invalid Authorization header', async() => {
            const response = await request(app).delete('/user/remove-account').set('Authorization', 'Bearer ');
            expect(response.body).toEqual({ error: "Invalid authorization header"});
        });

        it('Should return Invalid auth token', async() => {
            const response = await request(app).delete('/user/remove-account').set('Authorization', 'Bearer test');
            expect(response.body).toEqual({ error: "Invalid auth token"});
        });

        it('Should remove account successfully', async ()=> {
            const response = await request(app).delete('/user/remove-account').set('Authorization', `Bearer ${token}`);
            expect(response.body).toEqual({ message: "Account removed successfully"});
        });
    });
});