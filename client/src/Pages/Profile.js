// Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch profile and blogs after login
    axios.get('http://localhost:4000/profile', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setUser(response.data.user);
        setBlogs(response.data.blogs);
      })
      .catch(err => console.error('Error fetching profile and blogs:', err));
  }, []);

  return (
    <div>
      {user && (
        <div>
          <h1>{user.username}'s Profile</h1>
          <p>Email: {user.email}</p>
          <h2>Your Blogs:</h2>
          {blogs.length > 0 ? (
            <ul>
              {blogs.map(blog => (
                <li key={blog._id}>
                  <h3>{blog.title}</h3>
                  <p>{blog.content}</p>
                  <button>Edit</button>
                  <button>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No blogs yet!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
