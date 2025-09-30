// LikeController Formula:
// LikeController = toggleLike × authMiddleware
//                + checkUserLiked (public | auth)
//                + getLikeCount (public)
//                + getUserLikedArticles × authMiddleware

import { Request, Response } from 'express';
import { LikeService } from '../services/likeService';

export class LikeController {
  private likeService: LikeService;

  constructor() {
    this.likeService = new LikeService();
  }

  // Toggle like (Auth Required)
  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { articleId } = req.body;

      if (!articleId) {
        res.status(400).json({ error: 'Article ID is required' });
        return;
      }

      const result = await this.likeService.toggleLike(userId, articleId);

      res.json(result);
    } catch (error: any) {
      console.error('Toggle like error:', error);
      res.status(500).json({ error: error.message || 'Failed to toggle like' });
    }
  }

  // Check if user liked an article (Auth Optional)
  async checkUserLiked(req: Request, res: Response): Promise<void> {
    try {
      const { articleId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.json({ liked: false });
        return;
      }

      const liked = await this.likeService.checkUserLiked(userId, articleId);

      res.json({ liked });
    } catch (error: any) {
      console.error('Check user liked error:', error);
      res.status(500).json({ error: error.message || 'Failed to check like status' });
    }
  }

  // Get like count for an article (Public)
  async getLikeCount(req: Request, res: Response): Promise<void> {
    try {
      const { articleId } = req.params;

      const likeCount = await this.likeService.getLikeCount(articleId);

      res.json({ likeCount });
    } catch (error: any) {
      console.error('Get like count error:', error);
      res.status(500).json({ error: error.message || 'Failed to get like count' });
    }
  }

  // Get articles liked by user (Auth Required)
  async getUserLikedArticles(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.likeService.getUserLikedArticles(userId, page, limit);

      res.json({
        articles: result.articles,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      console.error('Get user liked articles error:', error);
      res.status(500).json({ error: error.message || 'Failed to get liked articles' });
    }
  }
}