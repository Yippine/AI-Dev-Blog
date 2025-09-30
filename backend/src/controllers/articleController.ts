// Article Controller
// ArticleController = Request -> Service -> Response

import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/articleService';
import { z } from 'zod';

const articleService = new ArticleService();

const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
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
}