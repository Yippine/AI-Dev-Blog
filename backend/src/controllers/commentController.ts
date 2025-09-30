// CommentController Formula:
// CommentController = createComment × authMiddleware
//                   + getCommentsByArticle (public)
//                   + deleteComment × authMiddleware × (owner | admin)
//                   + getUserComments × authMiddleware

import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  // Create a new comment (Auth Required)
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { articleId, content } = req.body;

      if (!articleId || !content) {
        res.status(400).json({ error: 'Article ID and content are required' });
        return;
      }

      if (content.trim().length === 0) {
        res.status(400).json({ error: 'Comment content cannot be empty' });
        return;
      }

      const comment = await this.commentService.createComment(userId, articleId, content);

      res.status(201).json(comment);
    } catch (error: any) {
      console.error('Create comment error:', error);
      res.status(500).json({ error: error.message || 'Failed to create comment' });
    }
  }

  // Get comments by article (Public)
  async getCommentsByArticle(req: Request, res: Response): Promise<void> {
    try {
      const { articleId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.commentService.getCommentsByArticle(articleId, page, limit);

      res.json({
        comments: result.comments,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      console.error('Get comments error:', error);
      res.status(500).json({ error: error.message || 'Failed to get comments' });
    }
  }

  // Delete a comment (Auth Required, Owner or Admin)
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const role = (req as any).user.role;
      const { commentId } = req.params;

      await this.commentService.deleteComment(commentId, userId, role);

      res.json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
      console.error('Delete comment error:', error);
      if (error.message === 'Permission denied') {
        res.status(403).json({ error: error.message });
      } else if (error.message === 'Comment not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || 'Failed to delete comment' });
      }
    }
  }

  // Get user's comments (Auth Required)
  async getUserComments(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.commentService.getUserComments(userId, page, limit);

      res.json({
        comments: result.comments,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      console.error('Get user comments error:', error);
      res.status(500).json({ error: error.message || 'Failed to get user comments' });
    }
  }
}