// Sitemap Controller
// SitemapController = DynamicSitemapGeneration(Articles + Categories + Tags)

import { Request, Response } from 'express';
import { articleService } from '../services/articleService';
import { categoryService } from '../services/categoryService';
import { tagService } from '../services/tagService';

export const sitemapController = {
  async generateSitemap(req: Request, res: Response) {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';

      // Fetch all articles, categories, and tags
      const articles = await articleService.getAllArticles();
      const categories = await categoryService.getAllCategories();
      const tags = await tagService.getAllTags();

      // Generate XML sitemap
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Homepage
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>1.0</priority>\n';
      xml += '  </url>\n';

      // Categories page
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/categories</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';

      // Tags page
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/tags</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';

      // Articles
      for (const article of articles) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/articles/${article.id}</loc>\n`;
        xml += `    <lastmod>${new Date(article.publishDate).toISOString()}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }

      // Categories
      for (const category of categories) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/categories/${category.slug}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      }

      // Tags
      for (const tag of tags) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/tags/${tag.slug}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.5</priority>\n';
        xml += '  </url>\n';
      }

      xml += '</urlset>';

      // Set response headers
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  },
};