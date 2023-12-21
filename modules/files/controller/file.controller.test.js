import request from 'supertest';
import app from '../../../index';

describe('Tests for File API', () => {
  let publicKey;
  let privateKey;

  // Test file data
  const testFile = {
    buffer: Buffer.from('test content'),
    originalname: 'test.txt',
  };

  // Test upload endpoint
  it('should upload a file and return public/private keys', async () => {
    const response = await request(app)
      .post('/files')
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
    const response = await request(app).delete(`/files/${privateKey}`);
    
    expect(response.body).toEqual({ message: 'File removed successfully' });
  });

  // Test non-existing file download
  it('should return 404 for non-existing file download', async () => {
    await request(app)
      .get('/files/nonexistingpublickey')
      .expect(404);
  });

  // Test non-existing file delete
  it('should return 404 for non-existing file delete', async () => {
    await request(app)
      .delete('/files/nonexistingprivatekey')
      .expect(404);
  });
});

// Close the server after all tests
afterAll((done) => {
  close(() => {
    done();
  });
});
