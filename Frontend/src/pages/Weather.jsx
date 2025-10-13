import React from 'react'
import Sidebar from '../components/Sidebar'
import "../scss/weather.scss"
export default function Weather() {
  return (
    
    <>
    <Sidebar/>
       <div className='weather'>
        <h1>Weather</h1>
       </div>
    </>
  )
}
