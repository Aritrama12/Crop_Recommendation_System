import React from 'react'
import Sidebar from '../components/Sidebar'
import "../scss/profile.scss"
export default function Profile() {
  return (
    <>
    <Sidebar/>
      <div className='profile'>
        <h1>Profile</h1>
      </div>
    </>
  )
}
