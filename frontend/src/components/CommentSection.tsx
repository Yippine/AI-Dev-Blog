// CommentSection Component Formula:
// CommentSection = CommentList + CommentForm + Pagination
// CommentList = Comment[] -> map(CommentItem)
// CommentItem = {user, content, time, deleteButton}
// CommentForm = (loggedIn) -> textarea + submitButton | loginPrompt

import React, { useState, useEffect } from 'react';
import { commentApi, Comment } from '../services/api';

interface CommentSectionProps {
  articleId: string;
  isAuthenticated: boolean;
  currentUserId?: string;
  currentUserRole?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  articleId,
  isAuthenticated,
  currentUserId,
  currentUserRole,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await commentApi.getCommentsByArticle(articleId, page, 20);
      setComments(response.comments);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      setError('Failed to load comments');
      console.error('Load comments error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId, page]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await commentApi.createComment(articleId, newComment);
      setNewComment('');
      setPage(1);
      await loadComments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit comment');
      console.error('Submit comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentApi.deleteComment(commentId);
      await loadComments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete comment');
      console.error('Delete comment error:', err);
    }
  };

  const canDeleteComment = (comment: Comment): boolean => {
    if (!isAuthenticated) return false;
    if (currentUserRole === 'admin') return true;
    return comment.userId === currentUserId;
  };

  return (
    <div className="comment-section">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">Please login to leave a comment</p>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="text-center py-8">Loading comments...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 mb-2">
                  {comment.user?.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.nickname || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {(comment.user?.nickname || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.user?.nickname || 'Anonymous User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {canDeleteComment(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 ml-13 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;