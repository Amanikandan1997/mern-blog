import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BlogDetails() {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams(); // Extract the blog ID from the URL
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch the single blog based on the ID from the URL
    fetch(`http://localhost:4000/blogs/${id}`) // Update with your API endpoint
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((error) => {
        console.error('Error fetching the blog:', error);
        setError('There was an error fetching the blog details.');
      });
  }, [id]);

  return (
    <div className="container" style={{ padding: '30px' }}>
      {error && (
        <div className="col-12 text-center mb-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      {blog ? (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <img
                src={`http://localhost:4000${blog.image}`} // Adjust to your image serving path
                className="card-img-top"
                style={{ height: '400px', objectFit: 'cover' }}
                alt={blog.title}
              />
              <div className="card-body">
                <h5 className="card-title text-center">{blog.title}</h5>
                <p className="card-text">{blog.description}</p> {/* Full description */}
                {/* Display the username if available */}
                {blog.user && (
                  <p className="card-text text-center">
                    <strong>Author:</strong> {blog.user.username} {/* Display username */}
                  </p>
                )}
                {/* Go back button */}
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-12 text-center">
          <p>Loading blog...</p>
        </div>
      )}
    </div>
  );
}

export default BlogDetails;
