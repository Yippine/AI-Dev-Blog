// TagsPage Component
// TagsPage = TagCloud + ArticleCount + Navigation

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tagApi } from '../services/api';
import { Tag } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tagApi.getTags();
      setTags(result);
    } catch (err) {
      setError('無法載入標籤列表，請稍後再試');
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const getTagSize = (count: number) => {
    if (count >= 10) return 'text-2xl';
    if (count >= 5) return 'text-xl';
    return 'text-base';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTags} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">標籤雲</h1>
        <p className="text-gray-600">瀏覽所有文章標籤</p>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">目前沒有標籤</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-wrap gap-4">
            {tags.map(tag => (
              <Link
                key={tag.id}
                to={`/tags/${tag.slug}`}
                className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105 ${getTagSize(tag.articleCount || 0)}`}
              >
                <span>#{tag.name}</span>
                <span className="bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-sm">
                  {tag.articleCount || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}