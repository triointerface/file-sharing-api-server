import { faker } from '@faker-js/faker';
import UserService from './user.service';

describe('User service class', () => {
  let user;
  let userService;
  beforeAll(async () => {
    userService = new UserService();
  });

  const registrationPayload = {
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: '89G1wJuBLbGziIs',
  };

  it('should return empty array', async () => {
    const response = await userService.getUser({
      email: registrationPayload.email,
    });
    expect(response).toHaveLength(0);
  });

  it('should throw an error because first_name is required field', async () => {
    await expect(userService.createUser(registrationPayload)).rejects.toThrow();
  });

  it('should throw an error because first_name maximum length 200', async () => {
    registrationPayload.first_name = faker.string.alpha(201);
    await expect(userService.createUser(registrationPayload)).rejects.toThrow();
  });

  it('should create user successfully', async () => {
    registrationPayload.first_name = faker.person.firstName();
    const response = await userService.createUser(registrationPayload);
    expect(response).toHaveLength(1);
  });

  it('should return user details', async () => {
    const response = await userService.getUser({
      email: registrationPayload.email,
    });
    expect(response).toHaveLength(1);
    user = response.length > 0 ? response[0] : null;
  });

  it('remove account by id', async () => {
    const response = await userService.removeAccount(user.id);
    expect(response).toBe(1);
  });

  it('remove account by id', async () => {
    await expect(userService.removeAccount(user.id)).rejects.toThrow();
  });
});
