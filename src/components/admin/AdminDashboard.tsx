import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import RichTextEditor from './RichTextEditor';
import BlogPostManager from './BlogPostManager';
import { Database } from '../../types/supabase';

type BlogPost = Database['public']['Tables']['blog_posts']['Insert'];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    header_image: '',
    tags: [],
    slug: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManager, setShowManager] = useState(true);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = generateSlug(formData.title);
      const { error } = await supabase
        .from('blog_posts')
        .insert([{ ...formData, slug }]);

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        content: '',
        header_image: '',
        tags: [],
        slug: '',
      });
      setShowManager(true);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // First try to create the bucket if it doesn't exist
      const { data: buckets } = await supabase
        .storage
        .listBuckets();

      const blogBucket = buckets?.find(b => b.name === 'blog-images');
      
      if (!blogBucket) {
        const { error: createError } = await supabase
          .storage
          .createBucket('blog-images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/*']
          });
          
        if (createError) {
          console.error('Error creating bucket:', createError);
        }
      }

      // Upload the file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        header_image: publicUrl
      }));
    } catch (error: any) {
      console.error('Error details:', error);
      alert(`Error uploading image: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-saasha-brown dark:text-dark-text">Admin Dashboard</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowManager(!showManager)}
              className="bg-saasha-brown text-white px-4 py-2 rounded-md hover:bg-saasha-brown/90"
            >
              {showManager ? 'Create New Post' : 'Manage Posts'}
            </button>
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
        </div>

        {showManager ? (
          <BlogPostManager />
        ) : (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-primary dark:border-gray-600 dark:text-dark-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-saasha-brown dark:text-dark-text mb-1">
                  Header Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-primary dark:border-gray-600 dark:text-dark-text"
                />
                {formData.header_image && (
                  <img
                    src={formData.header_image}
                    alt="Header preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose dark:bg-dark-primary dark:border-gray-600 dark:text-dark-text"
                  placeholder="Enter tags..."
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
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
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-saasha-rose text-white py-2 px-4 rounded-md hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
