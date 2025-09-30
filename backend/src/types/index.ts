// Type definitions for Blog System
// Types = Article + Category + Tag + Query + Comment + Like

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  author: string;
  publishDate: Date;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleWithRelations extends Article {
  category: Category;
  tags: Tag[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ArticleListResponse {
  articles: ArticleWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  articleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithUser extends Comment {
  user: {
    id: string;
    nickname: string | null;
    avatar: string | null;
  };
}

export interface Like {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}