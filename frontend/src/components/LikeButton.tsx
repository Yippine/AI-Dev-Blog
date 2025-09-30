// LikeButton Component Formula:
// LikeButton = (isAuthenticated, articleId) -> {liked: Boolean, likeCount: Int, toggleAction}
// Visual = (liked) -> HeartIcon(filled | outline) + likeCount

import React, { useState, useEffect } from 'react';
import { likeApi } from '../services/api';

interface LikeButtonProps {
  articleId: string;
  initialLikeCount?: number;
  isAuthenticated: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  initialLikeCount = 0,
  isAuthenticated,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkLikedStatus();
    }
  }, [articleId, isAuthenticated]);

  const checkLikedStatus = async () => {
    try {
      const response = await likeApi.checkUserLiked(articleId);
      setLiked(response.liked);
    } catch (err) {
      console.error('Check liked status error:', err);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like this article');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      const response = await likeApi.toggleLike(articleId);
      setLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to toggle like');
      console.error('Toggle like error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        liked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* Heart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={liked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-semibold">{likeCount}</span>
      <span>{liked ? 'Liked' : 'Like'}</span>
    </button>
  );
};

export default LikeButton;