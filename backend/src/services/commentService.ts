// CommentService Formula:
// CommentService = createComment(userId, articleId, content) -> Comment
//                + getCommentsByArticle(articleId, pagination) -> Comment[]
//                + deleteComment(commentId, userId, role) -> Boolean
//                + updateArticleCommentCount(articleId) -> Void

import prisma from '../utils/prisma';
import { Comment, CommentWithUser } from '../types';

export class CommentService {
  // Create a new comment
  async createComment(userId: string, articleId: string, content: string): Promise<Comment> {
    // Verify article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        articleId,
      },
    });

    // Update article comment count
    await prisma.article.update({
      where: { id: articleId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    return comment;
  }

  // Get comments by article with pagination
  async getCommentsByArticle(
    articleId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ comments: CommentWithUser[]; total: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { articleId },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: { articleId },
      }),
    ]);

    return { comments, total };
  }

  // Delete a comment (user can delete own comment, admin can delete any)
  async deleteComment(commentId: string, userId: string, role: string): Promise<boolean> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check permission
    if (role !== 'admin' && comment.userId !== userId) {
      throw new Error('Permission denied');
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Update article comment count
    await prisma.article.update({
      where: { id: comment.articleId },
      data: {
        commentCount: {
          decrement: 1,
        },
      },
    });

    return true;
  }

  // Get user's comments
  async getUserComments(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ comments: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { userId },
        include: {
          article: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: { userId },
      }),
    ]);

    return { comments, total };
  }
}