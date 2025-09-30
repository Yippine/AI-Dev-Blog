// API Service
// ApiService = HttpClient(axios) + Endpoints + AuthInterceptor
// InteractionAPI = CommentAPI + LikeAPI

import axios from 'axios';
import { ArticleListResponse, Article, Category, Tag } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const articleApi = {
  getArticles: (page = 1, limit = 10): Promise<ArticleListResponse> =>
    api.get('/articles', { params: { page, limit } }).then(res => res.data),

  getArticleById: (id: string): Promise<Article> =>
    api.get(`/articles/${id}`).then(res => res.data),

  getArticlesByCategory: (slug: string, page = 1, limit = 10): Promise<ArticleListResponse> =>
    api.get(`/categories/${slug}/articles`, { params: { page, limit } }).then(res => res.data),

  getArticlesByTag: (slug: string, page = 1, limit = 10): Promise<ArticleListResponse> =>
    api.get(`/tags/${slug}/articles`, { params: { page, limit } }).then(res => res.data),
};

export const categoryApi = {
  getCategories: (): Promise<Category[]> =>
    api.get('/categories').then(res => res.data),

  getCategoryBySlug: (slug: string): Promise<Category> =>
    api.get(`/categories/${slug}`).then(res => res.data),
};

export const tagApi = {
  getTags: (): Promise<Tag[]> =>
    api.get('/tags').then(res => res.data),

  getTagBySlug: (slug: string): Promise<Tag> =>
    api.get(`/tags/${slug}`).then(res => res.data),
};

// Comment API
export interface Comment {
  id: string;
  content: string;
  userId: string;
  articleId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    nickname: string | null;
    avatar: string | null;
  };
}

export interface CommentListResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const commentApi = {
  getCommentsByArticle: (articleId: string, page = 1, limit = 20): Promise<CommentListResponse> =>
    api.get(`/comments/article/${articleId}`, { params: { page, limit } }).then(res => res.data),

  createComment: (articleId: string, content: string): Promise<Comment> =>
    api.post('/comments', { articleId, content }).then(res => res.data),

  deleteComment: (commentId: string): Promise<{ message: string }> =>
    api.delete(`/comments/${commentId}`).then(res => res.data),

  getUserComments: (page = 1, limit = 20): Promise<CommentListResponse> =>
    api.get('/comments/user', { params: { page, limit } }).then(res => res.data),
};

// Like API
export const likeApi = {
  toggleLike: (articleId: string): Promise<{ liked: boolean; likeCount: number }> =>
    api.post('/likes', { articleId }).then(res => res.data),

  checkUserLiked: (articleId: string): Promise<{ liked: boolean }> =>
    api.get(`/likes/article/${articleId}/check`).then(res => res.data),

  getLikeCount: (articleId: string): Promise<{ likeCount: number }> =>
    api.get(`/likes/article/${articleId}/count`).then(res => res.data),

  getUserLikedArticles: (page = 1, limit = 20): Promise<ArticleListResponse> =>
    api.get('/likes/user', { params: { page, limit } }).then(res => res.data),
};

export default api;