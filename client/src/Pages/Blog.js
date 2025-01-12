import React from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const blogs = [
    { id: 1, title: 'Blog Post 1', summary: 'Summary of blog post 1' },
    { id: 2, title: 'Blog Post 2', summary: 'Summary of blog post 2' },
  ];

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              <h2>{blog.title}</h2>
              <p>{blog.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blog;
