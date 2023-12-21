import { jwtPrivateKey } from '../../../config/env.js';
import jsonwebtoken from 'jsonwebtoken';

export function GenerateToken(user) {
    return jsonwebtoken.sign((user), jwtPrivateKey, { expiresIn: "7d" });
}

export function VerifyToken(token) {
    return jsonwebtoken.verify(token, jwtPrivateKey);
}