// API Routes
// Routes = ArticleRoutes + CategoryRoutes + TagRoutes

import { Router } from 'express';
import { ArticleController } from '../controllers/articleController';
import { CategoryController } from '../controllers/categoryController';
import { TagController } from '../controllers/tagController';

const router = Router();

const articleController = new ArticleController();
const categoryController = new CategoryController();
const tagController = new TagController();

// Article routes
router.get('/articles', articleController.getArticles.bind(articleController));
router.get('/articles/:id', articleController.getArticleById.bind(articleController));

// Category routes
router.get('/categories', categoryController.getCategories.bind(categoryController));
router.get('/categories/:slug', categoryController.getCategoryBySlug.bind(categoryController));
router.get('/categories/:slug/articles', articleController.getArticlesByCategory.bind(articleController));

// Tag routes
router.get('/tags', tagController.getTags.bind(tagController));
router.get('/tags/:slug', tagController.getTagBySlug.bind(tagController));
router.get('/tags/:slug/articles', articleController.getArticlesByTag.bind(articleController));

export default router;