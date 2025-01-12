const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const User = require('./models/Users');
const Blog = require('./models/Blog');

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// CRUD for Blogs
// Create Blog
app.post('/blogs', authenticateUser, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const blog = new Blog({
    title,
    description,
    image,
    user: req.user.id, // Associate the blog with the logged-in user
  });

  try {
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog' });
  }
});
// Get Blog Details by ID
app.get('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  try {
    const blog = await Blog.findById(id).populate('user', 'username email'); // Populate the user field to get user details (if required)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ message: 'Error fetching blog details' });
  }
});

// Get All Blogs (For All Users)
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Get Blogs for a Particular User
app.get('/user/blogs', authenticateUser, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }); // Fetch blogs created by the logged-in user
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user blogs' });
  }
});

// Update Blog
app.put('/blogs/:id', authenticateUser, upload.single('image'), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  const { title, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this blog' });
    }

    blog.title = title;
    blog.description = description;
    blog.image = image || blog.image;

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog' });
  }
});

// Delete Blog
app.delete('/blogs/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(id);
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
