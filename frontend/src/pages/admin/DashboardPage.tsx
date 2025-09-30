// DashboardPage Formula:
// DashboardPage = StatsCards(articles, categories, tags) + RecentArticlesList

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Stats {
  articlesCount: number;
  categoriesCount: number;
  tagsCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ articlesCount: 0, categoriesCount: 0, tagsCount: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes, tagsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/articles?limit=5`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/tags`)
        ]);

        setStats({
          articlesCount: articlesRes.data.pagination.total,
          categoriesCount: categoriesRes.data.length,
          tagsCount: tagsRes.data.length
        });

        setRecentArticles(articlesRes.data.articles);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Articles</p>
              <p className="text-3xl font-bold mt-2">{stats.articlesCount}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Categories</p>
              <p className="text-3xl font-bold mt-2">{stats.categoriesCount}</p>
            </div>
            <div className="text-4xl">📁</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tags</p>
              <p className="text-3xl font-bold mt-2">{stats.tagsCount}</p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Recent Articles</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentArticles.map((article) => (
            <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👁️ {article.viewCount} views</span>
                    <span>📁 {article.category.name}</span>
                    <span>📅 {new Date(article.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link
                  to={`/admin/articles/${article.id}/edit`}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}