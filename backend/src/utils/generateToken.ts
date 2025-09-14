import jwt from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '24h'
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};
