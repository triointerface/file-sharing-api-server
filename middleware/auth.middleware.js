import JwtService from '../modules/shared/service/jwt.service.js';
import UserService from '../modules/user/service/user.service.js';

const userService = new UserService();

const AuthMiddleWare = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }

  const token = authorizationHeader.replace('Bearer ', '');

  if (!token.trim()) {
    return res.status(401).json({ error: 'Authorization token not found' });
  }

  try {
    const decoded = JwtService.VerifyToken(token);
    const user = await userService.getUser({ id: decoded.id });
    if (!user || (Array.isArray(user) && user.length === 0)) {
      throw new Error();
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
};

export default AuthMiddleWare;
