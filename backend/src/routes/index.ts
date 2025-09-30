// API Routes
// Routes = PublicRoutes(GET) + AdminRoutes(POST + PUT + DELETE × AuthMiddleware × requireRole('admin'))
//        + UserRoutes(register, login, profile × AuthMiddleware) + AuthRoutes(admin_login) + UploadRoutes

import { Router } from 'express';
import { ArticleController } from '../controllers/articleController';
import { CategoryController } from '../controllers/categoryController';
import { TagController } from '../controllers/tagController';
import { AuthController } from '../controllers/authController';
import { UploadController } from '../controllers/uploadController';
import { UserController } from '../controllers/userController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

const articleController = new ArticleController();
const categoryController = new CategoryController();
const tagController = new TagController();
const authController = new AuthController();
const uploadController = new UploadController();
const userController = new UserController();

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
// Admin login (existing)
router.post('/auth/login', authController.login.bind(authController));

// ========== User Routes ==========
// User registration and login (Public)
router.post('/users/register', userController.register.bind(userController));
router.post('/users/login', userController.login.bind(userController));

// User profile management (Auth Required)
router.get('/users/profile', authMiddleware, userController.getProfile.bind(userController));
router.put('/users/profile', authMiddleware, userController.updateProfile.bind(userController));
router.put('/users/password', authMiddleware, userController.changePassword.bind(userController));
router.post('/users/avatar', authMiddleware, upload.single('avatar'), userController.uploadAvatar.bind(userController));

// ========== Admin Routes (Auth Required + Admin Role) ==========

// Article CRUD (Admin)
router.post('/articles', authMiddleware, requireRole('admin'), articleController.createArticle.bind(articleController));
router.put('/articles/:id', authMiddleware, requireRole('admin'), articleController.updateArticle.bind(articleController));
router.delete('/articles/:id', authMiddleware, requireRole('admin'), articleController.deleteArticle.bind(articleController));

// Category CRUD (Admin)
router.post('/categories', authMiddleware, requireRole('admin'), categoryController.createCategory.bind(categoryController));
router.put('/categories/:id', authMiddleware, requireRole('admin'), categoryController.updateCategory.bind(categoryController));
router.delete('/categories/:id', authMiddleware, requireRole('admin'), categoryController.deleteCategory.bind(categoryController));

// Tag CRUD (Admin)
router.post('/tags', authMiddleware, requireRole('admin'), tagController.createTag.bind(tagController));
router.put('/tags/:id', authMiddleware, requireRole('admin'), tagController.updateTag.bind(tagController));
router.delete('/tags/:id', authMiddleware, requireRole('admin'), tagController.deleteTag.bind(tagController));

// Upload (Admin)
router.post('/upload/image', authMiddleware, requireRole('admin'), upload.single('image'), uploadController.uploadImage.bind(uploadController));

export default router;