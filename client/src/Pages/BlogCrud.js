import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BlogCrud() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null); // For editing a blog
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs from the backend
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Handle input changes for title, description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file change for image upload
  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  // Handle submit for creating or updating a blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = new FormData();
    blogData.append('title', formData.title);
    blogData.append('description', formData.description);
    if (formData.image) {
      blogData.append('image', formData.image);
    }

    try {
      if (editBlog) {
        // If editing, send PUT request
        const response = await axios.put(`/api/blogs/${editBlog.id}`, blogData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const updatedBlogs = blogs.map((blog) =>
          blog.id === response.data.id ? response.data : blog
        );
        setBlogs(updatedBlogs);
      } else {
        // If creating new blog, send POST request
        const response = await axios.post('/api/blogs', blogData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs((prevBlogs) => [...prevBlogs, response.data]);
      }

      // Reset form and edit state
      setFormData({
        title: '',
        description: '',
        image: null,
      });
      setEditBlog(null);
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  // Handle edit blog
  const handleEdit = (blog) => {
    setEditBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      image: null, // You can keep the old image or add a new one
    });
  };

  // Handle delete blog
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{editBlog ? 'Edit Blog' : 'Create Blog'}</h2>
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
          {editBlog ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>

      <hr />

      <h2>Your Blogs</h2>
      <div className="list-group mt-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{blog.title}</h5>
                <p>{blog.description}</p>
                {blog.image && <img src={blog.image} alt={blog.title} width="100" />}
              </div>
              <div>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(blog)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDelete(blog.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default BlogCrud;
