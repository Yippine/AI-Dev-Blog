// LikeService Formula:
// LikeService = toggleLike(userId, articleId) -> {liked: Boolean, likeCount: Int}
//             + checkUserLiked(userId, articleId) -> Boolean
//             + getLikeCount(articleId) -> Int

import prisma from '../utils/prisma';

export class LikeService {
  // Toggle like (add if not exists, remove if exists)
  async toggleLike(userId: string, articleId: string): Promise<{ liked: boolean; likeCount: number }> {
    // Verify article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    let liked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Unlike: remove like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Update article like count
      const updatedArticle = await prisma.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      liked = false;
      likeCount = updatedArticle.likeCount;
    } else {
      // Like: add like
      await prisma.like.create({
        data: {
          userId,
          articleId,
        },
      });

      // Update article like count
      const updatedArticle = await prisma.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      liked = true;
      likeCount = updatedArticle.likeCount;
    }

    return { liked, likeCount };
  }

  // Check if user has liked an article
  async checkUserLiked(userId: string, articleId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    return !!like;
  }

  // Get like count for an article
  async getLikeCount(articleId: string): Promise<number> {
    const count = await prisma.like.count({
      where: { articleId },
    });

    return count;
  }

  // Get articles liked by user
  async getUserLikedArticles(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { userId },
        include: {
          article: {
            include: {
              category: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.like.count({
        where: { userId },
      }),
    ]);

    const articles = likes.map((like: any) => like.article);

    return { articles, total };
  }
}