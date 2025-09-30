// Frontend Type Definitions
// Types = Article + Category + Tag + API + User + Comment + Like

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  author: string;
  publishDate: string;
  viewCount: number;
  commentCount?: number;
  likeCount?: number;
  categoryId: string;
  category: Category;
  tags: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  articleCount?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticleListResponse {
  articles: Article[];
  pagination: Pagination;
}

export interface User {
  id: string;
  email: string;
  role: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
}