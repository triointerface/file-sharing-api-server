// fileService.test.js
import FileService from './file.service';
import { prototype } from './localFileSystemProvider';
import { provider } from '../../../config/env';

jest.mock('./localFileSystemProvider');

const publicKey = '584b897f-5870-41c2-85e2-54c8d1d0c8dd';
const privateKey = 'f8f7001a-fbd4-43b4-a95a-84922c4efb76';

describe('Integration tests for FileService with Local Provider', () => {
  let fileService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mocking the provider based on the environment
    provider = 'local';
    fileService = new FileService();
  });

  // Test uploadFile method
  it('should upload a file and return public/private keys', async () => {
    const mockFile = {
      buffer: Buffer.from('test content'),
      originalname: 'test.txt',
    };

    // Mock the provider's uploadFile method
    prototype.uploadFile.mockResolvedValueOnce({
      publicKey,
      privateKey,
    });

    const result = await fileService.uploadFile(mockFile);

    expect(result).toHaveProperty('publicKey');
    expect(result).toHaveProperty('privateKey');
    // Ensure that the provider's uploadFile method was called with the mock file
    expect(prototype.uploadFile).toHaveBeenCalledWith(mockFile);
  });

//   Test downloadFile method
  it('should download the uploaded file', async () => {
    const mockPublicKey = publicKey;

    // Mock the provider's downloadFile method
    prototype.downloadFile.mockResolvedValueOnce(Buffer.from('test content'));

    const result = await fileService.downloadFile(mockPublicKey);

    expect(result).toEqual(Buffer.from('test content'));
    // Ensure that the provider's downloadFile method was called with the mock public key
    expect(prototype.downloadFile).toHaveBeenCalledWith(mockPublicKey);
  });


   // Test downloadFile method with file not found
   it('should handle file not found error during download', async () => {
    const mockPublicKey = 'nonExistingFilePublicKey';

    // Mock the provider's downloadFile method to simulate a file not found error
    prototype.downloadFile.mockRejectedValueOnce(new Error('File not found'));

    await expect(fileService.downloadFile(mockPublicKey)).rejects.toThrow('File not found');
    // Ensure that the provider's downloadFile method was called with the mock public key
    expect(prototype.downloadFile).toHaveBeenCalledWith(mockPublicKey);
  });


  // Test removeFile method
  it('should remove the uploaded file', async () => {
    const mockPrivateKey = privateKey;

    // Mock the provider's removeFile method
    prototype.removeFile.mockResolvedValueOnce({ message: 'File removed successfully' });

    const result = await fileService.removeFile(mockPrivateKey);

    expect(result).toEqual({ message: 'File removed successfully' });
    // Ensure that the provider's removeFile method was called with the mock private key
    expect(prototype.removeFile).toHaveBeenCalledWith(mockPrivateKey);
  });

  it('should handle file not found error during removal', async () => {
    const privateKey = 'invalidprivatekey';
    prototype.removeFile.mockRejectedValueOnce(new Error('File not found'));
    await expect(fileService.removeFile(privateKey)).rejects.toThrow('File not found');
  });
  
});
