import { faker } from '@faker-js/faker';
import FileService from './file.service.js';
import UserService from '../../user/service/user.service.js';

describe('File Service', () => {
  let fileService;
  let userService;
  let user;
  let privateKey;
  // let publicKey;
  const userCreationData = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: '',
  };

  const mockFile = {
    buffer: Buffer.from('test content'),
    originalname: 'test.txt',
    mimetype: 'text/plain',
  };

  beforeAll(async () => {
    userService = new UserService();
    fileService = new FileService();
    await userService.createUser(userCreationData);
    const users = await userService.getUser({ email: userCreationData.email });
    user = users.length > 0 ? users[0] : null;
  });

  afterAll(async () => {
    await userService.removeAccount(user.id);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock the provider's uploadFile method
  it('should upload file and return public, private key', async () => {
    const result = await fileService.uploadFile(mockFile, user.id);
    expect(result).toHaveProperty('publicKey');
    expect(result).toHaveProperty('privateKey');
    // publicKey = result.publicKey;
    privateKey = result.privateKey;
  });

  // Test downloadFile method with file not found
  it('should handle file not found error during download', async () => {
    const invalidPublicKey = 'invalidPublicKey';
    await expect(fileService.downloadFile(invalidPublicKey)).rejects.toThrow(
      'File not found',
    );
  });

  // Test downloadfile method
  /**
   * @Todo it return readable file stream. Need to check the jest file stream match
   */
  /**
    it('should download the uploaded file', async () => {
    const result = await fileService.downloadFile(publicKey);
    });
   */

  // Test Remove file with invalid private key and valid userId
  it('should handle file not found error during removal', async () => {
    const invalidPrivateKey = 'InvalidPrivateKey';
    await expect(fileService.removeFile(invalidPrivateKey, user.id)).rejects.toThrow(
      'File not found',
    );
  });

  // Remove file with valid private key and userId
  it('should remove the uploaded file', async () => {
    const result = await fileService.removeFile(privateKey, user.id);
    expect(result).toEqual({ message: 'File removed successfully' });
  });
});
