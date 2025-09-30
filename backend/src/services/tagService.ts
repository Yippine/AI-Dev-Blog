// Tag Service Layer
// TagService = List(Tag) + TagCloud(count)

import prisma from '../utils/prisma';

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
}