// ArticlesPage Formula:
// ArticlesPage = ArticlesList(table) + SearchFilter + CreateButton -> ArticleEditorPage

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  status: string;
  author: string;
  category: { name: string };
  viewCount: number;
  publishDate: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/articles?limit=50`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/articles/${id}`);
      alert('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link
          to="/admin/articles/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New Article
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.author}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{article.viewCount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.publishDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Link
                    to={`/admin/articles/${article.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No articles found. Create your first article!
          </div>
        )}
      </div>
    </div>
  );
}