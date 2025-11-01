import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import "../scss/recommendation.scss"

export default function Recommendation() {

     const [formData, setFormData]=useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: "",
     });

    const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      N: "",
      P: "",
      K: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    // alert("Prediction submitted with values: " + JSON.stringify(formData, null, 2));
  };
  return (
    <>
    <Sidebar/>
      <h1 className='heading'>Crop Recommendation</h1>
      <div className="crop-form-container">
      
      <form >
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field}
            required
          />
        ))}
        <div className="button-group">
          <button type="submit" className="predict-btn">
            Predict
          </button>
          <button type="button" className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
      <p>Enter your values to get a recommendation.</p>
    </div>
    
    </>
  )
}
