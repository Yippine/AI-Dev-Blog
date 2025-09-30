// UserService Formula:
// UserService = register(email, password, nickname?) -> User
//             + login(email, password) -> JWT + User
//             + getProfile(userId) -> User
//             + updateProfile(userId, data) -> User
//             + changePassword(userId, oldPassword, newPassword) -> void
//             + updateAvatar(userId, avatarUrl) -> User

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AuthService } from './authService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

export interface RegisterInput {
  email: string;
  password: string;
  nickname?: string;
}

export interface UpdateProfileInput {
  nickname?: string;
  bio?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

export class UserService {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Register: EmailValidation -> PasswordHashing -> CreateUser -> AutoLogin
  async register(input: RegisterInput): Promise<{ token: string; user: UserResponse }> {
    const { email, password, nickname } = input;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength (min 8 chars)
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname: nickname || null,
        role: 'user'
      }
    });

    // Auto-login: Generate JWT
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return {
      token,
      user: this.formatUserResponse(user)
    };
  }

  // Login: CredentialValidation -> JWTGeneration
  async login(email: string, password: string): Promise<{ token: string; user: UserResponse }> {
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
      user: this.formatUserResponse(user)
    };
  }

  // GetProfile: FetchUser
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUserResponse(user);
  }

  // UpdateProfile: ValidateInput -> UpdateUser
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname: input.nickname !== undefined ? input.nickname : user.nickname,
        bio: input.bio !== undefined ? input.bio : user.bio
      }
    });

    return this.formatUserResponse(updatedUser);
  }

  // ChangePassword: VerifyOldPassword -> HashNewPassword -> UpdateUser
  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const { oldPassword, newPassword } = input;

    // Validate new password strength
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.authService.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });
  }

  // UpdateAvatar: UploadFile -> UpdateUser
  async updateAvatar(userId: string, avatarUrl: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl }
    });

    return this.formatUserResponse(updatedUser);
  }

  // Helper: Format user response (exclude password)
  private formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    };
  }
}