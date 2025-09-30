// Article Service Layer
// ArticleService = CRUD(Article) + Pagination + Relations
//                + CreateArticle(input) -> Article
//                + UpdateArticle(id, input) -> Article
//                + DeleteArticle(id) -> void

import prisma from '../utils/prisma';
import { PaginationQuery, ArticleListResponse } from '../types';

export interface CreateArticleInput {
  title: string;
  content: string;
  summary?: string;
  author: string;
  categoryId: string;
  tagIds: string[];
  status?: string;
}

export interface UpdateArticleInput {
  title?: string;
  content?: string;
  summary?: string;
  author?: string;
  categoryId?: string;
  tagIds?: string[];
  status?: string;
}

export class ArticleService {
  // GET /articles - List with pagination
  async getArticles(query: PaginationQuery): Promise<ArticleListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        skip,
        take: limit,
        orderBy: { publishDate: 'desc' },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      }),
      prisma.article.count()
    ]);

    const articlesWithTags = articles.map(article => ({
      ...article,
      tags: article.tags.map(at => at.tag)
    }));

    return {
      articles: articlesWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // GET /articles/:id - Get single article
  async getArticleById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    return {
      ...article,
      tags: article.tags.map(at => at.tag)
    };
  }

  // GET /categories/:slug/articles - Articles by category
  async getArticlesByCategory(slug: string, query: PaginationQuery): Promise<ArticleListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const category = await prisma.category.findUnique({
      where: { slug }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { categoryId: category.id },
        skip,
        take: limit,
        orderBy: { publishDate: 'desc' },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      }),
      prisma.article.count({ where: { categoryId: category.id } })
    ]);

    const articlesWithTags = articles.map(article => ({
      ...article,
      tags: article.tags.map(at => at.tag)
    }));

    return {
      articles: articlesWithTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // GET /tags/:slug/articles - Articles by tag
  async getArticlesByTag(slug: string, query: PaginationQuery): Promise<ArticleListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const tag = await prisma.tag.findUnique({
      where: { slug }
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    const [articleTags, total] = await Promise.all([
      prisma.articleTag.findMany({
        where: { tagId: tag.id },
        skip,
        take: limit,
        include: {
          article: {
            include: {
              category: true,
              tags: {
                include: {
                  tag: true
                }
              }
            }
          }
        },
        orderBy: { article: { publishDate: 'desc' } }
      }),
      prisma.articleTag.count({ where: { tagId: tag.id } })
    ]);

    const articles = articleTags.map(at => ({
      ...at.article,
      tags: at.article.tags.map(t => t.tag)
    }));

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // POST /articles - Create new article (Admin)
  async createArticle(input: CreateArticleInput) {
    const { tagIds, ...articleData } = input;

    // Create article with tags
    const article = await prisma.article.create({
      data: {
        ...articleData,
        publishedAt: input.status === 'published' ? new Date() : null,
        tags: {
          create: tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    // Update category article count
    await prisma.category.update({
      where: { id: articleData.categoryId },
      data: { articleCount: { increment: 1 } }
    });

    return {
      ...article,
      tags: article.tags.map(at => at.tag)
    };
  }

  // PUT /articles/:id - Update article (Admin)
  async updateArticle(id: string, input: UpdateArticleInput) {
    const { tagIds, ...articleData } = input;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: { tags: true }
    });

    if (!existingArticle) {
      throw new Error('Article not found');
    }

    // Update article
    const updateData: any = { ...articleData };

    // If status changed to published, set publishedAt
    if (input.status === 'published' && existingArticle.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    // Update tags if provided
    if (tagIds) {
      // Remove existing tags
      await prisma.articleTag.deleteMany({
        where: { articleId: id }
      });

      // Add new tags
      await prisma.articleTag.createMany({
        data: tagIds.map(tagId => ({
          articleId: id,
          tagId
        }))
      });
    }

    // Refetch with updated tags
    const updatedArticle = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return {
      ...updatedArticle!,
      tags: updatedArticle!.tags.map(at => at.tag)
    };
  }

  // DELETE /articles/:id - Delete article (Admin)
  async deleteArticle(id: string) {
    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // Delete article (cascades to ArticleTag)
    await prisma.article.delete({
      where: { id }
    });

    // Update category article count
    await prisma.category.update({
      where: { id: article.categoryId },
      data: { articleCount: { decrement: 1 } }
    });
  }
}