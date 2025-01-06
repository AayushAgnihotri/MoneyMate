import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-background"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <h5>MoneyMate</h5>
            <p>Your smart financial companion</p>
          </div>
          <div className="col-lg-4">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h5>Connect With Us</h5>
            <div className="social-links">
              <button className="social-link">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="social-link">
                <i className="fab fa-facebook"></i>
              </button>
              <button className="social-link">
                <i className="fab fa-linkedin"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
