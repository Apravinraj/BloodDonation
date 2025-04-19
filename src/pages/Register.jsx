import React from 'react'
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '/src/firebase';
const Register = () => {

    const [formData,setFormData] = useState({
        name: '',
        age: '',
        bloodGroup: '',
        location: '',
        email:'',
        contact: '',
        availability: 'Yes',
      });


    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value 
        })
    }

    const handleSubmit= async (e) => {
        e.preventDefault();
  try {
    await addDoc(collection(db, "donors"), formData);
    alert("Donor registered successfully!");
    setFormData({
      name: '',
      age: '',
      bloodGroup: '',
      location: '',
      email: '',
      contact: '',
      availability: 'Yes',
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
    }

  return (
    <div className="container mt-4">
    <h2 className="mb-4 text-danger">Register as Donor</h2>
    <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Age</label>
        <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Blood Group</label>
        <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
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
      <div className="mb-3">
        <label className="form-label">Location</label>
        <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Contact  Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Contact Phone </label>
        <input type="tel" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Availability</label>
        <select className="form-select" name="availability" value={formData.availability} onChange={handleChange}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <button type="submit" className="btn btn-danger">Register</button>
    </form>
  </div>
);
  
}

export default Register
