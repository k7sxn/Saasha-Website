import React from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost as BlogPostType } from '../../types/blog';

interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-saasha-cream dark:bg-dark-primary">
      <article className="max-w-4xl mx-auto">
        <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden">
          <img
            src={post.headerImage}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>

        <h1 className="text-4xl font-bold text-saasha-brown dark:text-dark-text mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 text-sm font-medium bg-saasha-rose/10 text-saasha-rose dark:bg-dark-accent/10 dark:text-dark-accent rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-8 text-gray-600 dark:text-dark-text/70">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <div className="prose prose-lg dark:prose-invert prose-saasha max-w-none">
          {/* We'll need to implement a proper markdown or rich text renderer here */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
