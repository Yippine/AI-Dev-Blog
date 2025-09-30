// Tag Controller
// TagController = Request -> Service -> Response
//               + CreateTag -> AuthMiddleware -> Service.create()
//               + UpdateTag -> AuthMiddleware -> Service.update()
//               + DeleteTag -> AuthMiddleware -> Service.delete()

import { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tagService';
import { z } from 'zod';

const tagService = new TagService();

const createTagSchema = z.object({
  name: z.string().min(1).max(30),
  slug: z.string().min(1).max(30)
});

const updateTagSchema = z.object({
  name: z.string().min(1).max(30).optional(),
  slug: z.string().min(1).max(30).optional()
});

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

  // POST /tags (Admin)
  async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createTagSchema.parse(req.body);
      const tag = await tagService.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      next(error);
    }
  }

  // PUT /tags/:id (Admin)
  async updateTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateTagSchema.parse(req.body);
      const tag = await tagService.updateTag(id, validatedData);
      res.json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }
      next(error);
    }
  }

  // DELETE /tags/:id (Admin)
  async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await tagService.deleteTag(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}