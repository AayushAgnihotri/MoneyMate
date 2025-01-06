import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import './home.css';

const features = [
  {
    icon: '📊',
    title: 'Expense Tracking',
    description: 'Easily track your daily expenses and categorize them automatically.'
  },
  {
    icon: '🎯',
    title: 'Budget Planning',
    description: 'Set and manage budgets with smart alerts and recommendations.'
  },
  {
    icon: '💰',
    title: 'Savings Goals',
    description: 'Create and track your savings goals with visual progress indicators.'
  },
  {
    icon: '⏰',
    title: 'Bill Reminders',
    description: 'Never miss a payment with automated bill reminders and alerts.'
  },
  {
    icon: '🤖',
    title: 'AI Predictions',
    description: 'Get intelligent predictions about your future spending patterns.'
  },
  {
    icon: '📈',
    title: 'Financial Insights',
    description: 'Understand your finances better with detailed analytics and reports.'
  }
];

const Home = () => {
  return (
    <div className="moneymate-home">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <div className="hero-shape shape1"></div>
          <div className="hero-shape shape2"></div>
          <div className="hero-shape shape3"></div>
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Smart Financial Tracking for Your Future
              </h1>
              <p className="hero-subtitle">
                Take control of your finances with AI-powered insights and easy-to-use tools.
              </p>
              <Link to="/register" className="btn btn-lg btn-primary get-started-btn">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose MoneyMate?</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-content">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-content">
                <h2 className="section-title">About MoneyMate</h2>
                <p className="about-text">
                  MoneyMate is your intelligent financial companion, designed to help you make smarter decisions about your money. Our AI-powered platform provides personalized insights and recommendations to help you achieve your financial goals.
                </p>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>50K+</h3>
                    <p>Active Users</p>
                  </div>
                  <div className="stat-card">
                    <h3>$2M+</h3>
                    <p>Savings Tracked</p>
                  </div>
                  <div className="stat-card">
                    <h3>4.8/5</h3>
                    <p>User Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
