import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';

// Warn if fallback secrets are used in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    console.error('[SECURITY] JWT_SECRET is not set. Using insecure fallback. Set JWT_SECRET immediately.');
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    console.error('[SECURITY] REFRESH_TOKEN_SECRET is not set. Using insecure fallback. Set REFRESH_TOKEN_SECRET immediately.');
  }
}

// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions);
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(40).toString('hex');
};

export const generateTokenPair = (payload: TokenPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(),
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const expiryMs = REFRESH_TOKEN_EXPIRES_IN.endsWith('d')
    ? parseInt(REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60 * 1000
    : parseInt(REFRESH_TOKEN_EXPIRES_IN) * 60 * 60 * 1000;
  return new Date(Date.now() + expiryMs);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
