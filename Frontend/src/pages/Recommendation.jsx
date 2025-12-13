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

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      //fetch the data from ml model-> api: http://127.0.0.1:8000/api/predict
      // using fetch api
const res = await fetch("http://127.0.0.1:8000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert("Recommended Crop: " + data.crop);
    }catch (error) {
      alert("Error: " + error.message);
    }
    
    
  };
  return (
    <>
    <Sidebar/>
      <h1 className='heading'>Crop Recommendation</h1>
      <div className="crop-form-container">
      
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={"Enter The amount of "+field}
            required
          />
        ))}
        <div className="button-group">
          <button type="submit" className="predict-btn" >
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
