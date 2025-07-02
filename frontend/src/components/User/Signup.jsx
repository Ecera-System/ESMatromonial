import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import videoBg from '../assets/romantic-background-2.mp4';



function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: false
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: ''
  });

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);
    
    return {
      valid: hasMinLength && hasSpecialChar && hasCapitalLetter,
      messages: [
        !hasMinLength && 'Minimum 8 characters',
        !hasSpecialChar && 'At least 1 special character',
        !hasCapitalLetter && '1 capital letter'
      ].filter(Boolean)
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.messages.join(', ');
        valid = false;
      }
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log('Form submitted:', formData);
      alert('Account created successfully!');
    }
  };

  return (
      <div className="video-background">
      {/* Add video element */}
     <video autoPlay loop muted playsInline>
  <source src={videoBg} type="video/mp4" />
  Your browser does not support the video tag.
</video>

    <div className="signup-page">
      <div className="signup-container">
        <div className="logo">
          Get ready to connect <FaHeart className="heart-icon" />
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className={errors.terms ? 'error' : ''}
            />
            <label htmlFor="terms">I read and agree to Terms & Conditions</label>
            {errors.terms && (
              <span className="error-message">{errors.terms}</span>
            )}
          </div>
          
          <button type="submit" className="submit-btn">CREATE ACCOUNT</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Signup;