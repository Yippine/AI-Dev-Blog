// Category Service Layer
// CategoryService = List(Category) + Count(Articles)

import prisma from '../utils/prisma';

export class CategoryService {
  // GET /categories - List all categories
  async getCategories() {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    return categories.map(cat => ({
      ...cat,
      articleCount: cat._count.articles
    }));
  }

  // GET /categories/:slug - Get category by slug
  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return {
      ...category,
      articleCount: category._count.articles
    };
  }
}