import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToSection } from '../utils/scrollUtils';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="text-primary fw-bold">Money</span>
          <span className="text-success">Mate</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a 
                href="#home" 
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#features" 
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'features')}
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#about" 
                className="nav-link"
                onClick={(e) => handleNavClick(e, 'about')}
              >
                About
              </a>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
