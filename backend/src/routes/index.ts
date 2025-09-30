// API Routes
// Routes = PublicRoutes(GET) + AdminRoutes(POST + PUT + DELETE × AuthMiddleware) + AuthRoutes + UploadRoutes

import { Router } from 'express';
import { ArticleController } from '../controllers/articleController';
import { CategoryController } from '../controllers/categoryController';
import { TagController } from '../controllers/tagController';
import { AuthController } from '../controllers/authController';
import { UploadController } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

const articleController = new ArticleController();
const categoryController = new CategoryController();
const tagController = new TagController();
const authController = new AuthController();
const uploadController = new UploadController();

// ========== Public Routes (No Auth) ==========

// Article routes (Public)
router.get('/articles', articleController.getArticles.bind(articleController));
router.get('/articles/:id', articleController.getArticleById.bind(articleController));

// Category routes (Public)
router.get('/categories', categoryController.getCategories.bind(categoryController));
router.get('/categories/:slug', categoryController.getCategoryBySlug.bind(categoryController));
router.get('/categories/:slug/articles', articleController.getArticlesByCategory.bind(articleController));

// Tag routes (Public)
router.get('/tags', tagController.getTags.bind(tagController));
router.get('/tags/:slug', tagController.getTagBySlug.bind(tagController));
router.get('/tags/:slug/articles', articleController.getArticlesByTag.bind(articleController));

// ========== Auth Routes ==========
router.post('/auth/login', authController.login.bind(authController));

// ========== Admin Routes (Auth Required) ==========

// Article CRUD (Admin)
router.post('/articles', authMiddleware, articleController.createArticle.bind(articleController));
router.put('/articles/:id', authMiddleware, articleController.updateArticle.bind(articleController));
router.delete('/articles/:id', authMiddleware, articleController.deleteArticle.bind(articleController));

// Category CRUD (Admin)
router.post('/categories', authMiddleware, categoryController.createCategory.bind(categoryController));
router.put('/categories/:id', authMiddleware, categoryController.updateCategory.bind(categoryController));
router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory.bind(categoryController));

// Tag CRUD (Admin)
router.post('/tags', authMiddleware, tagController.createTag.bind(tagController));
router.put('/tags/:id', authMiddleware, tagController.updateTag.bind(tagController));
router.delete('/tags/:id', authMiddleware, tagController.deleteTag.bind(tagController));

// Upload (Admin)
router.post('/upload/image', authMiddleware, upload.single('image'), uploadController.uploadImage.bind(uploadController));

export default router;