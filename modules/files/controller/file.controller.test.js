import request from 'supertest';
import app from '../../../index.js';
import { faker } from '@faker-js/faker';

describe('Tests for File API', () => {
  let publicKey;
  let privateKey;
  let token;

  const userCreationData = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: '89G1wJuBLbGziIs',
    confirm_password: '89G1wJuBLbGziIs',
  }


  beforeAll(async () => {
    await request(app).post('/user/register').set('Accept', 'application/json').send(userCreationData);
    const response = await request(app).post('/user/login').set('Accept', 'application/json').send(userCreationData);
    token = response.body;
  });

  afterAll(async () => {
    await request(app).delete('/user/remove-account').set('Authorization', `Bearer ${token}`);
    app.close();
  });

  afterEach(() => {
    app.close();
  });

  // Test file data
  const testFile = {
    buffer: Buffer.from('test content'),
    originalname: 'test.txt',
  };

  // Test upload endpoint
  it('should upload a file and return public/private keys', async () => {
    const response = await request(app)
      .post('/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', testFile.buffer, testFile.originalname);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('publicKey');
    expect(response.body).toHaveProperty('privateKey');

    publicKey = response.body.publicKey;
    privateKey = response.body.privateKey;
  });

  // Test download endpoint
  it('should download the uploaded file', async () => {
    const response = await request(app).get(`/files/${publicKey}`);
    expect(response.status).toBe(200);
  });

  // Test delete endpoint
  it('should delete the uploaded file', async () => {
    const response = await request(app).delete(`/files/${privateKey}`).set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({ message: 'File removed successfully' });
  });

  // Test non-existing file download
  it('should return 404 for non-existing file download', async () => {
    request(app)
      .get('/files/nonexistingpublickey')
      .expect(404);
  });

  // Test non-existing file delete
  it('should return 404 for non-existing file delete', async () => {
    request(app)
      .delete('/files/nonexistingprivatekey')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
