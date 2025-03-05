import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BlogFormData } from '../../types/blog';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    headerImage: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically send the data to a backend API
    console.log('Blog post data:', formData);
    // Reset form
    setFormData({
      title: '',
      content: '',
      headerImage: '',
      tags: [],
    });
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-saasha-brown dark:text-dark-text">Admin Dashboard</h1>
          <button
            onClick={() => {
              logout();
              navigate('/admin');
            }}
            className="bg-saasha-rose text-white px-4 py-2 rounded-md hover:bg-saasha-rose/90"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-saasha-brown dark:text-dark-text">Create New Blog Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                Header Image URL
              </label>
              <input
                type="url"
                required
                value={formData.headerImage}
                onChange={(e) => setFormData({ ...formData, headerImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                Tags (Press Enter to add)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose"
                placeholder="Enter tags..."
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-saasha-rose text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 hover:text-saasha-cream"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                Content
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-saasha-rose text-white py-2 px-4 rounded-md hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose"
            >
              Publish Blog Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
