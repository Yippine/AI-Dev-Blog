// HomePage Component
// HomePage = ArticleList + Pagination + Loading + Error + SEO

import { useState, useEffect } from 'react';
import { articleApi } from '../services/api';
import { ArticleListResponse } from '../types';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';

export default function HomePage() {
  const [data, setData] = useState<ArticleListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchArticles = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await articleApi.getArticles(page, 10);
      setData(result);
    } catch (err) {
      setError('無法載入文章列表，請稍後再試');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchArticles(currentPage)} />;
  if (!data || data.articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">目前沒有文章</p>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="Blog System - 最新文章"
        description="探索最新發布的技術文章、程式設計教學和開發心得"
        keywords="blog, articles, tech, programming, web development"
        type="website"
      />
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">最新文章</h1>
        <p className="text-gray-600">探索最新發布的內容</p>
      </div>

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
    </div>
  );
}