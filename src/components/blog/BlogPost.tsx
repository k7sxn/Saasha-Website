import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      if (!data) {
        navigate('/blog');
        return;
      }

      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
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

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-saasha-cream dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
            {post.title}
          </h1>
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
          <p className="text-gray-600 dark:text-dark-text/70">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        {post.header_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.header_image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-saasha-brown dark:prose-headings:text-dark-text prose-a:text-saasha-rose hover:prose-a:text-saasha-rose/80"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
};

export default BlogPost;
