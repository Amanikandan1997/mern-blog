
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './Component/Navbar';
import Blog from './Pages/Blog';
import BlogDetails from './Pages/BlogDetails';
import Footer from './Component/Footer';
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard';


function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dash" element={<Dashboard/>} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
  
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
