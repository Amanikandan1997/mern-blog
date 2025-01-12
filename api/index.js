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

// CRUD for Blogs
// Create Blog
app.post('/blogs', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const blog = new Blog({ title, description, image });
  await blog.save();
  res.status(201).json(blog);
});

// Get All Blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Update Blog
app.put('/blogs/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  const { title, description} = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const blog = await Blog.findByIdAndUpdate(id, { title, description, image }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog' });
  }
});

// Delete Blog
app.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
});

// Get Single Blog by ID
app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Blog ID' });
    }
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      res.json(blog); // Return the full blog object
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog' });
    }
  });
  
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
