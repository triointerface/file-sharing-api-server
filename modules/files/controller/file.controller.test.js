import request from 'supertest';
import app from '../../../index.js';

describe('Tests for File API', () => {
  let publicKey;
  let privateKey;
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZmlyc3RfbmFtZSI6ImpvYmF5ZXIiLCJsYXN0X25hbWUiOiJhaG1lZCIsImVtYWlsIjoiYWEyQGV4YW1wbGUuY29tIiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMjFUMDQ6NTc6MTQuMDAwWiIsImlhdCI6MTcwMzI2NjIzMywiZXhwIjoxNzAzODcxMDMzfQ.GaOt140btyPhOaOVunKDkSfXVig010UY2e44HjACngg';
  
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
