// API Service
// ApiService = HttpClient(axios) + Endpoints

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

export default api;