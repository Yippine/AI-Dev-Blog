// TagArticlesPage Component
// TagArticlesPage = TagInfo + ArticleList + Pagination

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleApi, tagApi } from '../services/api';
import { ArticleListResponse, Tag } from '../types';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function TagArticlesPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ArticleListResponse | null>(null);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page: number) => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const [articlesResult, tagResult] = await Promise.all([
        articleApi.getArticlesByTag(slug, page, 10),
        tagApi.getTagBySlug(slug)
      ]);
      setData(articlesResult);
      setTag(tagResult);
    } catch (err) {
      setError('無法載入文章列表，請稍後再試');
      console.error('Error fetching tag articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [slug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchData(currentPage)} />;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/tags" className="text-blue-600 hover:text-blue-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            #{tag?.name || '標籤文章'}
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          共 {data?.pagination.total || 0} 篇文章
        </p>
      </div>

      {!data || data.articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">此標籤暫無文章</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:gap-8">
            {data.articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}