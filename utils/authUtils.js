import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const secretKey = process.env.SECRET_KEY;


export function generateToken(userId, email) {
  try {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = now + 15 * 60; // 15 mins
    const refreshTokenExpiry = now + 36 * 60 * 60; // 36 hrs

    const authTokenPayload = {
      _id: userId,
      email,
      exp: accessTokenExpiry,
      iat: now,
    };

    const refreshTokenPayload = {
      _id: userId,
      exp: refreshTokenExpiry,
    };

    const authToken = jwt.sign(authTokenPayload, secretKey);
    const refreshToken = jwt.sign(refreshTokenPayload, secretKey);

    logger.info(`Tokens generated for user: ${email}`);
    return { authToken, refreshToken };
  } catch (err) {
    logger.error(`Token generation failed: ${err.message}`);
    throw new Error('Token generation failed');
  }
}


export async function hashPassword(password) {
  try {
    const hashed = await bcrypt.hash(password, 10);
    logger.info('Password hashed successfully');
    return hashed;
  } catch (err) {
    logger.error(`Password hashing failed: ${err.message}`);
    throw new Error('Password hashing failed');
  }
}


export async function comparePassword(currentPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
    logger.info(`Password comparison result: ${isMatch}`);
    return isMatch;
  } catch (err) {
    logger.error(`Password comparison failed: ${err.message}`);
    return false;
  }
}
