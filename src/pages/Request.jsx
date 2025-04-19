import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import emailjs from 'emailjs-com';

const Request = () => {
  const [requestData, setRequestData] = useState({
    patientName: '',
    bloodGroup: '',
    hospital: '',
    urgency: '',
    contact: '',
  });

  const handleChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save to Firestore
      const timestamp = new Date();
      await addDoc(collection(db, "requests"),{ ...requestData,timestamp});

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
            to_email: donor.contact,
            patient: requestData.patientName,
            hospital: requestData.hospital,
            urgency: requestData.urgency,
            contact: requestData.contact,
            date_time: formattedDate, 
          },
          "pDyLC2yaQD3chb6Uf"
        );
      });

      alert("Request submitted and emails sent to matching donors!");
      setRequestData({
        patientName: '',
        bloodGroup: '',
        hospital: '',
        urgency: '',
        contact: '',
      });
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-danger mb-4">Request Blood</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <input name="patientName" value={requestData.patientName} onChange={handleChange} placeholder="Patient Name" className="form-control mb-3" required />
        <select name="bloodGroup" value={requestData.bloodGroup} onChange={handleChange} className="form-select mb-3" required>
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option><option value="A−">A−</option>
          <option value="B+">B+</option><option value="B−">B−</option>
          <option value="AB+">AB+</option><option value="AB−">AB−</option>
          <option value="O+">O+</option><option value="O−">O−</option>
        </select>
        <input name="hospital" value={requestData.hospital} onChange={handleChange} placeholder="Hospital Name" className="form-control mb-3" required />
        <input name="urgency" value={requestData.urgency} onChange={handleChange} placeholder="Urgency (e.g. Immediate)" className="form-control mb-3" required />
        <input name="contact" value={requestData.contact} onChange={handleChange} placeholder="Your Contact (Email or Phone)" className="form-control mb-3" required />
        <button type="submit" className="btn btn-danger">Submit Request</button>
      </form>
    </div>
  );
};

export default Request;
