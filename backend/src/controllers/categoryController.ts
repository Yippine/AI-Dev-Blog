// Category Controller
// CategoryController = Request -> Service -> Response
//                    + CreateCategory -> AuthMiddleware -> Service.create()
//                    + UpdateCategory -> AuthMiddleware -> Service.update()
//                    + DeleteCategory -> AuthMiddleware -> Service.delete()

import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';
import { z } from 'zod';

const categoryService = new CategoryService();

const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  description: z.string().optional()
});

const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(50).optional(),
  description: z.string().optional()
});

export class CategoryController {
  // GET /categories
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  // GET /categories/:slug
  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const category = await categoryService.getCategoryBySlug(slug);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  // POST /categories (Admin)
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await categoryService.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      next(error);
    }
  }

  // PUT /categories/:id (Admin)
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await categoryService.updateCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      next(error);
    }
  }

  // DELETE /categories/:id (Admin)
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}