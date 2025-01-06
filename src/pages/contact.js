import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form data:', formData);
    // Add form submission logic here
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <div className="contact-header">
          <div className="container">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Please fill out this form or shoot us an email.</p>
          </div>
        </div>

        <div className="contact-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="contact-info-card">
                  <h2>Get in Touch</h2>
                  <div className="contact-methods">
                    <div className="contact-method">
                      <i className="fas fa-map-marker-alt"></i>
                      <div>
                        <h3>Visit Us</h3>
                        <p>123 Finance Street<br />Money City, MC 12345</p>
                      </div>
                    </div>
                    <div className="contact-method">
                      <i className="fas fa-envelope"></i>
                      <div>
                        <h3>Email Us</h3>
                        <p>support@moneymate.com<br />info@moneymate.com</p>
                      </div>
                    </div>
                    <div className="contact-method">
                      <i className="fas fa-phone"></i>
                      <div>
                        <h3>Call Us</h3>
                        <p>+1 (555) 123-4567<br />+1 (555) 765-4321</p>
                      </div>
                    </div>
                  </div>
                  <div className="social-links mt-4">
                    <h3>Follow Us</h3>
                    <div className="d-flex gap-3">
                    <button className="social-link" onClick={() => console.log("Twitter link clicked")}>
  <i className="fab fa-twitter"></i>
</button>
<button className="social-link" onClick={() => console.log("Facebook link clicked")}>
  <i className="fab fa-facebook"></i>
</button>
<button className="social-link" onClick={() => console.log("LinkedIn link clicked")}>
  <i className="fab fa-linkedin"></i>
</button>

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="contact-form-card">
                  <h2>Send us a Message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="form-control"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact; 