// Article Controller
// ArticleController = Request -> Service -> Response
//                   + CreateArticle(req, res) -> AuthMiddleware -> Service.create()
//                   + UpdateArticle(req, res) -> AuthMiddleware -> Service.update()
//                   + DeleteArticle(req, res) -> AuthMiddleware -> Service.delete()

import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/articleService';
import { z } from 'zod';

const articleService = new ArticleService();

const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
});

const createArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  summary: z.string().optional(),
  author: z.string().min(1),
  categoryId: z.string().min(1),
  tagIds: z.array(z.string()),
  status: z.enum(['draft', 'published']).default('draft')
});

const updateArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  summary: z.string().optional(),
  author: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional()
});

export class ArticleController {
  // GET /articles
  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const query = paginationSchema.parse(req.query);
      const result = await articleService.getArticles(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /articles/:id
  async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const article = await articleService.getArticleById(id);
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  // GET /categories/:slug/articles
  async getArticlesByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const query = paginationSchema.parse(req.query);
      const result = await articleService.getArticlesByCategory(slug, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /tags/:slug/articles
  async getArticlesByTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const query = paginationSchema.parse(req.query);
      const result = await articleService.getArticlesByTag(slug, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /articles (Admin)
  async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createArticleSchema.parse(req.body);
      const article = await articleService.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
        return;
      }
      next(error);
    }
  }

  // PUT /articles/:id (Admin)
  async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateArticleSchema.parse(req.body);
      const article = await articleService.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
        return;
      }
      next(error);
    }
  }

  // DELETE /articles/:id (Admin)
  async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await articleService.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}