// UserController Formula:
// UserController = registerHandler(req, res) -> ValidationSchema -> UserService.register -> Response
//                + loginHandler(req, res) -> ValidationSchema -> UserService.login -> Response
//                + getProfileHandler(req, res) -> UserService.getProfile -> Response
//                + updateProfileHandler(req, res) -> ValidationSchema -> UserService.updateProfile -> Response
//                + changePasswordHandler(req, res) -> ValidationSchema -> UserService.changePassword -> Response
//                + uploadAvatarHandler(req, res) -> FileUpload -> UserService.updateAvatar -> Response

import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/userService';

// Validation Schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  nickname: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const updateProfileSchema = z.object({
  nickname: z.string().optional(),
  bio: z.string().optional()
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // POST /api/users/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await this.userService.register({
        email: validatedData.email,
        password: validatedData.password,
        nickname: validatedData.nickname
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(400).json({
          error: error.message || 'Registration failed'
        });
      }
    }
  }

  // POST /api/users/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await this.userService.login(
        validatedData.email,
        validatedData.password
      );

      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(401).json({
          error: error.message || 'Login failed'
        });
      }
    }
  }

  // GET /api/users/profile
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userService.getProfile(userId);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json({
        error: error.message || 'User not found'
      });
    }
  }

  // PUT /api/users/profile
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate input
      const validatedData = updateProfileSchema.parse(req.body);

      // Update profile
      const user = await this.userService.updateProfile(userId, validatedData);

      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(400).json({
          error: error.message || 'Profile update failed'
        });
      }
    }
  }

  // PUT /api/users/password
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate input
      const validatedData = changePasswordSchema.parse(req.body);

      // Change password
      await this.userService.changePassword(userId, {
        oldPassword: validatedData.oldPassword,
        newPassword: validatedData.newPassword
      });

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(400).json({
          error: error.message || 'Password change failed'
        });
      }
    }
  }

  // POST /api/users/avatar
  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // File should be uploaded via multer middleware
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Get file URL (assuming upload middleware attaches path)
      const avatarUrl = `/uploads/${req.file.filename}`;

      // Update avatar
      const user = await this.userService.updateAvatar(userId, avatarUrl);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Avatar upload failed'
      });
    }
  }
}