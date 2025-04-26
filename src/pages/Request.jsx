import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import { FaUser, FaHospital, FaPhone, FaTint, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import './Request.css';

const Request = () => {
  const [requestData, setRequestData] = useState({
    patientName: '',
    bloodGroup: '',
    hospital: '',
    urgency: 'Normal',
    contact: '',
    unitsRequired: '1',
    requiredDate: '',
    patientCondition: '',
    doctorName: '',
    hospitalAddress: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Save to Firestore
      const timestamp = new Date();
      await addDoc(collection(db, "requests"), { 
        ...requestData,
        timestamp,
        status: 'Pending'
      });

      // Find matching donors
      const donorRef = collection(db, "donors");
      const q = query(
        donorRef,
        where("bloodGroup", "==", requestData.bloodGroup),
        where("availability", "==", "Yes")
      );
      const snapshot = await getDocs(q);
      const donors = snapshot.docs.map(doc => doc.data());
      const formattedDate = timestamp.toLocaleString();

      // Send email to each matching donor
      donors.forEach(donor => {
        emailjs.send(
          "service_p82us47",
          "template_71rsyde",
          {
            to_email: donor.email,
            to_name: donor.name,
            patient: requestData.patientName,
            hospital: requestData.hospital,
            urgency: requestData.urgency,
            contact: requestData.contact,
            date_time: formattedDate,
            blood_group: requestData.bloodGroup,
            units_required: requestData.unitsRequired,
            required_date: requestData.requiredDate,
            hospital_address: requestData.hospitalAddress
          },
          "pDyLC2yaQD3chb6Uf"
        ).catch(emailError => {
          console.error("Email sending failed:", emailError);
        });
      });

      setSuccessMessage(`Request submitted successfully! Notifications sent to ${donors.length} potential donors.`);
      setRequestData({
        patientName: '',
        bloodGroup: '',
        hospital: '',
        urgency: 'Normal',
        contact: '',
        unitsRequired: '1',
        requiredDate: '',
        patientCondition: '',
        doctorName: '',
        hospitalAddress: ''
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      setSuccessMessage('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-container">
      <div className="request-header">
        <h1><FaTint /> Blood Request Form</h1>
        <p>Fill out this form to request blood donations for your patient</p>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        {/* Patient Information */}
        <div className="form-section">
          <h2><FaUser /> Patient Details</h2>
          <div className="form-group">
            <label htmlFor="patientName">Patient Full Name*</label>
            <input 
              type="text" 
              id="patientName"
              name="patientName" 
              value={requestData.patientName} 
              onChange={handleChange} 
              placeholder="Enter patient's full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="patientCondition">Patient Condition</label>
            <textarea
              id="patientCondition"
              name="patientCondition" 
              value={requestData.patientCondition} 
              onChange={handleChange} 
              placeholder="Brief description of patient's condition"
              rows="3"
            />
          </div>
        </div>

        {/* Blood Requirements */}
        <div className="form-section">
          <h2><FaTint /> Blood Requirements</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group*</label>
              <select 
                id="bloodGroup"
                name="bloodGroup" 
                value={requestData.bloodGroup} 
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
              <label htmlFor="unitsRequired">Units Required*</label>
              <select 
                id="unitsRequired"
                name="unitsRequired" 
                value={requestData.unitsRequired} 
                onChange={handleChange} 
                required
              >
                <option value="1">1 Unit</option>
                <option value="2">2 Units</option>
                <option value="3">3 Units</option>
                <option value="4+">4+ Units</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requiredDate">Required By Date</label>
              <input
                type="date"
                id="requiredDate"
                name="requiredDate" 
                value={requestData.requiredDate} 
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Hospital Information */}
        <div className="form-section">
          <h2><FaHospital /> Hospital Information</h2>
          <div className="form-group">
            <label htmlFor="hospital">Hospital Name*</label>
            <input 
              type="text" 
              id="hospital"
              name="hospital" 
              value={requestData.hospital} 
              onChange={handleChange} 
              placeholder="Name of hospital"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hospitalAddress">Hospital Address*</label>
            <textarea
              id="hospitalAddress"
              name="hospitalAddress" 
              value={requestData.hospitalAddress} 
              onChange={handleChange} 
              placeholder="Full hospital address"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="doctorName">Attending Doctor</label>
            <input 
              type="text" 
              id="doctorName"
              name="doctorName" 
              value={requestData.doctorName} 
              onChange={handleChange} 
              placeholder="Doctor's name"
            />
          </div>
        </div>

        {/* Contact & Urgency */}
        <div className="form-section">
          <h2><FaPhone /> Contact & Urgency</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="urgency">Urgency Level*</label>
              <select 
                id="urgency"
                name="urgency" 
                value={requestData.urgency} 
                onChange={handleChange} 
                required
              >
                <option value="Normal">Normal (Within 48 hours)</option>
                <option value="Urgent">Urgent (Within 24 hours)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contact">Your Contact*</label>
              <input 
                type="text" 
                id="contact"
                name="contact" 
                value={requestData.contact} 
                onChange={handleChange} 
                placeholder="Phone or email"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-footer">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Blood Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Request;