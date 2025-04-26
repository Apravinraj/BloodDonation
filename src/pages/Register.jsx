
import React, { useState } from 'react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/src/firebase';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(''); // Specific error for email
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    location: '',
    email: '',
    contact: '',
    lastDonationDate: '',
    availability: 'Yes',
    healthConditions: '',
    weight: '',
    gender: '',
    address: '',
    pincode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value 
    });
    
    // Clear email error when user types
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const checkExistingDonor = async (email) => {
    try {
      const donorsRef = collection(db, "donors");
      const q = query(donorsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking donor:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setEmailError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.bloodGroup || !formData.location) {
        throw new Error('Please fill all required fields');
      }

      // Check if donor already exists with this email
      const donorExists = await checkExistingDonor(formData.email);
      if (donorExists) {
        setEmailError('This email is already registered as a donor');
        return;
      }

      // Add new donor
      await addDoc(collection(db, "donors"), {
        ...formData,
        createdAt: new Date(),
        lastUpdated: new Date(),
        status: 'active'
      });

      alert("Thank you for registering as a donor!");
      navigate('/profile');
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Become a Blood Donor</h1>
          <p>Your donation can save up to 3 lives. Join our community of lifesavers.</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Full Name*</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Age*</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  required 
                  min="18" 
                  max="65"
                  placeholder="18-65"
                />
              </div>

              <div className="form-group">
                <label>Gender*</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weight (kg)*</label>
                <input 
                  type="number" 
                  name="weight" 
                  value={formData.weight} 
                  onChange={handleChange} 
                  required 
                  min="50"
                  placeholder="Minimum 50kg"
                />
              </div>

              {/* Location Field Added Here */}
              <div className="form-group">
                <label>Location (City/District)*</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="Your city or district"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-group">
                <label>Email*</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>Phone Number*</label>
                <input 
                  type="tel" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
                  required 
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                />
              </div>

              <div className="form-group">
                <label>Address*</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  placeholder="Full address"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Pincode*</label>
                <input 
                  type="text" 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleChange} 
                  required 
                  pattern="[0-9]{6}"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>

            {/* Donation Information */}
            <div className="form-section">
              <h3>Donation Information</h3>
              <div className="form-group">
                <label>Blood Group*</label>
                <select 
                  name="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A−">A−</option>
                  <option value="B+">B+</option>
                  <option value="B−">B−</option>
                  <option value="AB+">AB+</option>
                  <option value="AB−">AB−</option>
                  <option value="O+">O+</option>
                  <option value="O−">O−</option>
                </select>
              </div>

              <div className="form-group">
                <label>Last Donation Date</label>
                <input 
                  type="date" 
                  name="lastDonationDate" 
                  value={formData.lastDonationDate} 
                  onChange={handleChange} 
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Currently Available to Donate?*</label>
                <select 
                  name="availability" 
                  value={formData.availability} 
                  onChange={handleChange} 
                  required
                >
                  <option value="Yes">Yes, I'm available</option>
                  <option value="No">Not currently available</option>
                </select>
              </div>

              <div className="form-group">
                <label>Any Health Conditions?</label>
                <textarea 
                  name="healthConditions" 
                  value={formData.healthConditions} 
                  onChange={handleChange} 
                  placeholder="Diabetes, hypertension, etc."
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>


          {emailError && (
            <div className="email-error-message">
              <FaExclamationTriangle className="error-icon" />
              <span>{emailError}</span>
            </div>
          )}


          <div className="form-footer">
            <p className="disclaimer">
              By registering, you agree to our terms and confirm that all information provided is accurate.
            </p>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                'Register as Donor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;