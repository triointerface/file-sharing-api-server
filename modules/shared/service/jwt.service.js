import { jwtPrivateKey } from '../../../config/env.js';
import jsonwebtoken from 'jsonwebtoken';

class JwtService {
    GenerateToken(user) {
        return jsonwebtoken.sign((user), jwtPrivateKey, { expiresIn: "7d" });
    }
    
    VerifyToken(token) {
        return jsonwebtoken.verify(token, jwtPrivateKey);
    }
}

export default new JwtService();