// AuthService Formula:
// AuthService = LoginValidation(email, password) -> JWTGeneration(user) -> TokenResponse
//             + JWTVerification(token) -> UserPayload

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

export interface LoginInput {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  // LoginValidation -> JWTGeneration
  async login(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  // JWTVerification
  verifyToken(token: string): JWTPayload {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // HashPassword (utility for user creation)
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}