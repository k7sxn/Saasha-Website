import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  header_image: string;
  tags: string[];
  slug: string;
  created_at: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    navigate(`/admin/edit/${post.slug}`, { state: { post } });
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== post.id));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-saasha-rose"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-saasha-brown dark:text-white">
        Manage Blog Posts
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 flex-1">
              {post.header_image && (
                <img
                  src={post.header_image}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-saasha-brown dark:text-white truncate">
                  {post.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-saasha-rose/10 text-saasha-rose dark:bg-saasha-rose/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose transition-colors"
                title="Edit post"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(post)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Delete post"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-saasha-rose dark:hover:text-saasha-rose transition-colors"
                title="View post"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManagement;
