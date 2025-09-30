// Tag Service Layer
// TagService = List(Tag) + TagCloud(count)
//            + CreateTag(input) -> Tag
//            + UpdateTag(id, input) -> Tag
//            + DeleteTag(id) -> void

import prisma from '../utils/prisma';

export interface CreateTagInput {
  name: string;
  slug: string;
}

export interface UpdateTagInput {
  name?: string;
  slug?: string;
}

export class TagService {
  // GET /tags - List all tags (tag cloud)
  async getTags() {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    return tags.map(tag => ({
      ...tag,
      articleCount: tag._count.articles
    }));
  }

  // GET /tags/:slug - Get tag by slug
  async getTagBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    return {
      ...tag,
      articleCount: tag._count.articles
    };
  }

  // POST /tags - Create tag (Admin)
  async createTag(input: CreateTagInput) {
    const tag = await prisma.tag.create({
      data: input
    });
    return tag;
  }

  // PUT /tags/:id - Update tag (Admin)
  async updateTag(id: string, input: UpdateTagInput) {
    const tag = await prisma.tag.update({
      where: { id },
      data: input
    });
    return tag;
  }

  // DELETE /tags/:id - Delete tag (Admin)
  async deleteTag(id: string) {
    // Check if tag has articles
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } }
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    if (tag._count.articles > 0) {
      throw new Error('Cannot delete tag with existing articles');
    }

    await prisma.tag.delete({
      where: { id }
    });
  }

  // GET all tags for sitemap generation
  async getAllTags() {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: 'asc' }
    });

    return tags;
  }
}

export const tagService = new TagService();