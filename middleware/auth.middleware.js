import JwtService from "../modules/shared/service/jwt.service.js";

const AuthMiddleWare = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ error: 'Invalid authorization header' });
    }

    const token = authorizationHeader.replace('Bearer ', '');

    if (!token) {
        return res
            .status(401)
            .json({ error: 'Authorization token not found' });
    }

    try {
        const decoded = JwtService.VerifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export default AuthMiddleWare;