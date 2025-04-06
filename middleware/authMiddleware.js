import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { apiResponse } from '../utils/ApiResponse.js';


const AuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(' Unauthorized: Missing or malformed token');
      return apiResponse(res, 401, false, 'Unauthorized: Token missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user_id = decoded._id;

    logger.info(`Authenticated user: ${decoded._id}`);
    next();
  } catch (err) {
    logger.error(`JWT verification failed: ${err.message}`);
    return apiResponse(res, 401, false, 'Unauthorized: Invalid or expired token');
  }
};

export default AuthMiddleware;
