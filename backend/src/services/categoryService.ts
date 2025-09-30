// Category Service Layer
// CategoryService = List(Category) + Count(Articles)
//                 + CreateCategory(input) -> Category
//                 + UpdateCategory(id, input) -> Category
//                 + DeleteCategory(id) -> void

import prisma from '../utils/prisma';

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
}

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

  // POST /categories - Create category (Admin)
  async createCategory(input: CreateCategoryInput) {
    const category = await prisma.category.create({
      data: input
    });
    return category;
  }

  // PUT /categories/:id - Update category (Admin)
  async updateCategory(id: string, input: UpdateCategoryInput) {
    const category = await prisma.category.update({
      where: { id },
      data: input
    });
    return category;
  }

  // DELETE /categories/:id - Delete category (Admin)
  async deleteCategory(id: string) {
    // Check if category has articles
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category._count.articles > 0) {
      throw new Error('Cannot delete category with existing articles');
    }

    await prisma.category.delete({
      where: { id }
    });
  }

  // GET all categories for sitemap generation
  async getAllCategories() {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: 'asc' }
    });

    return categories;
  }
}

export const categoryService = new CategoryService();