import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCrud from './BlogCrud';

function BlogCard() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');

  // Fetch blogs from the backend
  useEffect(() => {
    fetch('http://localhost:4000/blogs') // Update with your API endpoint
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => {
        console.error('Error fetching blogs:', error);
        setError('There was an error fetching the blogs. Please try again later.');
      });
  }, []);

  return (
    <div className="container" style={{ padding: '30px' }}>
      <BlogCrud/>
      <h1>Blog Posts</h1>
      <div className="row">
        {error && (
          <div className="col-12 text-center mb-4">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        )}

        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div className="col-md-4 mb-4" key={blog._id}>
              <div className="card">
                <img
                  src={`http://localhost:4000${blog.image}`} // Adjust to your image serving path
                  className="card-img-top"
                  style={{ height: '300px', objectFit: 'cover' }}
                  alt={blog.title}
                />
                <div className="card-body">
                  <h5 className="card-title text-center">{blog.title}</h5>
                  <p className="card-text text-center">
                    {blog.description.substring(0, 100)}... {/* Show short description */}
                  </p>
                  <Link to={`/blog/${blog._id}`} className="btn btn-primary d-block">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No blogs available. Create some blogs to display here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogCard;
