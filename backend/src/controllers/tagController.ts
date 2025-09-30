// Tag Controller
// TagController = Request -> Service -> Response

import { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tagService';

const tagService = new TagService();

export class TagController {
  // GET /tags
  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.getTags();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  // GET /tags/:slug
  async getTagBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const tag = await tagService.getTagBySlug(slug);
      res.json(tag);
    } catch (error) {
      next(error);
    }
  }
}