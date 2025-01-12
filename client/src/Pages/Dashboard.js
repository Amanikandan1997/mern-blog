import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [editingBlog, setEditingBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/');
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      if (editingBlog) {
        await axios.put(`http://localhost:4000/blogs/${editingBlog._id}`, form, { headers });
        setSuccessMessage('Blog updated successfully!');
      } else {
        const response = await axios.post('http://localhost:4000/blogs', form, { headers });
        setBlogs((prevBlogs) => [...prevBlogs, response.data]);
        setSuccessMessage('Blog created successfully!');
      }

      setFormData({
        title: '',
        description: '',
        image: null,
      });
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      image: null,
    });
  };

  const handleDelete = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/blogs/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccessMessage('Blog deleted successfully!');
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Welcome to the Dashboard</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Logout
      </button>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <div className="card mt-3 p-3 shadow">
        <h2>User Details</h2>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <hr />

      <h2>{editingBlog ? 'Edit Blog' : 'Create Blog'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Blog Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Blog Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingBlog ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>

      <hr />

      <h2 className="mt-4">All Blogs</h2>
      <ul className="list-group">
        {blogs.map((blog) => (
          <li key={blog._id} className="list-group-item">
            <h5>{blog.title}</h5>
            <p>{blog.description}</p>
            <button className="btn btn-warning" onClick={() => handleEdit(blog)}>
              Edit
            </button>
            <button className="btn btn-danger ml-2" onClick={() => handleDelete(blog._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
