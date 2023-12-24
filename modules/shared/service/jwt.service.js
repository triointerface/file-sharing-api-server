import jsonwebtoken from 'jsonwebtoken';
import { jwtPrivateKey } from '../../../config/env.js';

class JwtService {
  GenerateToken(user) {
    return jsonwebtoken.sign(user, jwtPrivateKey, { expiresIn: '7d' });
  }

  VerifyToken(token) {
    return jsonwebtoken.verify(token, jwtPrivateKey);
  }
}

export default new JwtService();
