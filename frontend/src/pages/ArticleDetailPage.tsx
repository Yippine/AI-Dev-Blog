// ArticleDetailPage Component
// ArticleDetailPage = ArticleContent + Metadata + Tags + Category + InteractionSystem
// InteractionSystem = LikeButton + ShareButtons + CommentSection

import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { articleApi } from '../services/api';
import { Article } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import LikeButton from '../components/LikeButton';
import ShareButtons from '../components/ShareButtons';
import CommentSection from '../components/CommentSection';
import { UserContext } from '../contexts/UserContext';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(UserContext);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const fetchArticle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const result = await articleApi.getArticleById(id);
      setArticle(result);
    } catch (err) {
      setError('無法載入文章內容，請稍後再試');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchArticle} />;
  if (!article) return <ErrorMessage message="文章不存在" />;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {article.author}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(article.publishDate)}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.viewCount} views
            </span>
            {article.commentCount !== undefined && (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {article.commentCount} comments
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Link to={`/categories/${article.category.slug}`} className="category-badge">
              {article.category.name}
            </Link>
            {article.tags.map(tag => (
              <Link key={tag.id} to={`/tags/${tag.slug}`} className="tag-badge">
                #{tag.name}
              </Link>
            ))}
          </div>
        </header>

        <div className="markdown-content">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Interaction Buttons */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <LikeButton
              articleId={article.id}
              initialLikeCount={article.likeCount || 0}
              isAuthenticated={isAuthenticated}
            />
            <ShareButtons articleId={article.id} title={article.title} />
          </div>
        </div>
      </article>

      {/* Comment Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mt-8">
        <CommentSection
          articleId={article.id}
          isAuthenticated={isAuthenticated}
          currentUserId={user?.id}
          currentUserRole={user?.role}
        />
      </div>

      <div className="mt-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Articles
        </Link>
      </div>
    </div>
  );
}