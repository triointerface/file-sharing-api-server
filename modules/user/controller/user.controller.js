import bcryptJS from 'bcryptjs';
import LoginSchema from '../schema/user-login.schema.js';
import RegistrationSchema from '../schema/user-registration.schema.js';
import UserService from '../service/user.service.js';
import JwtService from '../../shared/service/jwt.service.js';

class UserController {
  async login(req, res) {
    try {
      const validationResponse = await LoginSchema.validate(req.body, { strict: true });
      validationResponse.email = validationResponse.email.toLowerCase();
      const users = await UserService.getUser({ email: validationResponse.email, includePassword: true });

      if (!users || (Array.isArray(users) && users.length === 0)) {
        throw new Error('Invalid credentials.');
      }

      const user = users.pop();
      if (!bcryptJS.compareSync(validationResponse.password, user.password)) {
        throw new Error('Invalid credentials.');
      }
      delete user.password;
      const token = JwtService.GenerateToken(user);
      res.status(200).json(token);
    } catch (e) {
      res.status(401).json({ error: e.message.toString() });
    }
  }

  async register(req, res) {
    try {
      const validationResponse = await RegistrationSchema.validate(req.body, { strict: true });
      validationResponse.email = validationResponse.email.toLowerCase();
      const user = await UserService.getUser({ email: validationResponse.email });
      if (user && user.length > 0) {
        throw new Error('Email already used.');
      }

      delete validationResponse.confirm_password;
      validationResponse.password = bcryptJS.hashSync(validationResponse.password, bcryptJS.genSaltSync(10));
      const response = await UserService.createUser(validationResponse);
      if (Array.isArray(response) && response.length > 0) {
        res.status(201).json({
          message: 'User created successfully'
        });
      }
    } catch (e) {
      res.status(500).json({ error: e.message.toString() });
    }
  }

  async removeAccount(req, res) {
    try {
      const response = await UserService.removeAccount(req.user.id);
      if (response) {
        res.status(500).json({
          message: 'Account removed successfully',
        });
      }
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
}

export default UserController;
