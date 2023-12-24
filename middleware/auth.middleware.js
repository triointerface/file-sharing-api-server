import JwtService from '../modules/shared/service/jwt.service.js';
import UserService from '../modules/user/service/user.service.js';

// eslint-disable-next-line consistent-return
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
    const user = await UserService.getUser({ id: decoded.id });
    if (!user || (Array.isArray(user) && user.length === 0)) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
};

export default AuthMiddleWare;
