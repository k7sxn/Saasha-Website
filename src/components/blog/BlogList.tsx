import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-saasha-cream dark:bg-dark-primary">
        <div className="text-xl text-saasha-brown dark:text-dark-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-saasha-cream dark:bg-dark-primary min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-8">Our Blog</h1>
        {posts.length === 0 ? (
          <div className="text-center text-saasha-brown dark:text-dark-text py-12">
            No blog posts available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group"
              >
                <div className="bg-white dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:transform group-hover:scale-105">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.header_image}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-saasha-brown dark:text-dark-text mb-2 group-hover:text-saasha-rose dark:group-hover:text-dark-accent">
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs font-medium bg-saasha-rose/10 text-saasha-rose dark:bg-dark-accent/10 dark:text-dark-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-dark-text/70 text-sm">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
