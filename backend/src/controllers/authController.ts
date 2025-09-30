// AuthController Formula:
// AuthController = LoginEndpoint(req, res) -> AuthService.login() -> Response(token, user)

import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validatedData = loginSchema.parse(req.body);

      // Perform login
      const result = await this.authService.login(validatedData);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
        return;
      }

      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }
}