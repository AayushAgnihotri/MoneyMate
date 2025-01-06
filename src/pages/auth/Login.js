import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store complete user data from response
        const userData = {
          email: response.data.user.email,
          name: response.data.user.name
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data) {
        setError(error.response.data);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="brand-link">
              <span className="text-primary fw-bold">Money</span>
              <span className="text-success">Mate</span>
            </Link>
            <h2>Welcome back</h2>
            <p>Sign in to continue to MoneyMate</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
