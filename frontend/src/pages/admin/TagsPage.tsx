// TagsPage Formula:
// TagsPage = TagsList + CreateModal + EditModal + DeleteAction

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Tag {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const openModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        slug: tag.slug
      });
    } else {
      setEditingTag(null);
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormData({ name: '', slug: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await axios.put(`${import.meta.env.VITE_API_URL}/tags/${editingTag.id}`, formData);
        alert('Tag updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/tags`, formData);
        alert('Tag created successfully');
      }

      closeModal();
      fetchTags();
    } catch (error: any) {
      console.error('Failed to save tag:', error);
      alert(error.response?.data?.error || 'Failed to save tag');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tags/${id}`);
      alert('Tag deleted successfully');
      fetchTags();
    } catch (error: any) {
      console.error('Failed to delete tag:', error);
      alert(error.response?.data?.error || 'Failed to delete tag');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">Loading tags...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tags</h1>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New Tag
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-1">{tag.name}</h3>
            <p className="text-gray-600 text-xs mb-2">Slug: {tag.slug}</p>
            <p className="text-gray-500 text-sm mb-3">{tag.articleCount} articles</p>
            <div className="flex space-x-2">
              <button
                onClick={() => openModal(tag)}
                className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tag.id, tag.name)}
                className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tags found. Create your first tag!
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editingTag ? 'Edit Tag' : 'New Tag'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Tag name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="tag-slug"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingTag ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}