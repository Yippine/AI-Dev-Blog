// ArticleEditorPage Formula:
// ArticleEditorPage = Form(title, content_markdown, summary, category, tags, status) + MarkdownEditor(preview) + ImageUpload + Submit

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/tags`)
        ]);

        setCategories(categoriesRes.data);
        setTags(tagsRes.data);

        if (isEditMode && id) {
          const articleRes = await axios.get(`${import.meta.env.VITE_API_URL}/articles/${id}`);
          const article = articleRes.data;

          setTitle(article.title);
          setContent(article.content);
          setSummary(article.summary || '');
          setAuthor(article.author);
          setCategoryId(article.categoryId);
          setSelectedTagIds(article.tags.map((t: any) => t.id));
          setStatus(article.status);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to load data');
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !author || !categoryId || selectedTagIds.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title,
        content,
        summary,
        author,
        categoryId,
        tagIds: selectedTagIds,
        status
      };

      if (isEditMode && id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/articles/${id}`, payload);
        alert('Article updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/articles`, payload);
        alert('Article created successfully');
      }

      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Failed to save article:', error);
      alert(error.response?.data?.error || 'Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Edit Article' : 'New Article'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter article title"
          />
        </div>

        {/* Content (Markdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content (Markdown) <span className="text-red-500">*</span>
          </label>
          <SimpleMDE
            value={content}
            onChange={setContent}
            options={{
              spellChecker: false,
              placeholder: 'Write your article content in Markdown...',
              status: false,
              toolbar: [
                'bold',
                'italic',
                'heading',
                '|',
                'quote',
                'unordered-list',
                'ordered-list',
                '|',
                'link',
                'image',
                '|',
                'preview',
                'side-by-side',
                'fullscreen',
                '|',
                'guide'
              ]
            }}
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of the article"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Author name"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="draft"
                checked={status === 'draft'}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="mr-2"
              />
              Draft
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="published"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="mr-2"
              />
              Published
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Article' : 'Create Article'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}