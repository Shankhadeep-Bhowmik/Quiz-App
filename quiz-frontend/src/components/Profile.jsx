// src/Profile.jsx

import React from 'react';
// Assuming grayPerson.jpg is in the same directory or accessible path
import Person from '../assets/grayPreson.jpg';
import './Profile.css';

const Profile = () => {
  return (
    <>
      {/* Main container for the entire profile page content */}
      <div className="profile-container">
        {/* Section for User Image, Name, Email, and Date */}
        <div className="image-section"> {/* Renamed from 'image' to 'image-section' for clarity */}
          <img src={Person} alt="User Profile" className='user-image' />
          <h2 className='user-name'>Name Placeholder</h2> {/* Renamed from 'name' for clarity, added placeholder */}
          <p className='user-email'>email123@gmail.com</p> {/* Renamed from 'email' for clarity */}
          <p className='user-date'>yyyy-mm-dd</p> {/* Renamed from 'date' for clarity */}
        </div>

        {/* Section for User Statistics/Details */}
        <div className="user-details-section"> {/* Renamed from 'user-details' for clarity */}
          <div className="stat-box"> {/* Renamed from 'box' to 'stat-box' for clarity */}
            <h2 className='current-rank'>Current Rank</h2>
            <h1>0</h1>
          </div>
          <div className="stat-box">
            <h2 className='total-score'>Total Score</h2>
            <h1>0</h1>
          </div>
          <div className="stat-box">
            <h2 className='total-quiz-attempt'>Total Quiz Attempt</h2>
            <h1>0</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
