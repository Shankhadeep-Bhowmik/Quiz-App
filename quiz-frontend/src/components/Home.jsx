import React from 'react';
import './Home.css';
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <nav className='nav-container'>
        <div className='nav-logo'>
          {/* <a href="#home">QUIZ APP</a> */}
          <Link to="/">QUIZ APP</Link>
        </div>
        <ul className='nav-links'>
          {/* <li><Link to="/">Home</Link></li> */}
          <li><Link to="/quiz">Quizzes</Link></li>
          
        </ul>
        <div className='btns'>
          <button className='loginBtn'><Link to="/login" >Login</Link></button>
          <button className='signupBtn'><Link to="/signup">Sign Up</Link></button>
        </div>
      </nav>
      <div className='dashBoard'>
        <h1>Welcome to Quiz App</h1>
        <p>Test your knowledge by giving quizzes</p>
      </div>
    </>
  )
}

export default Home;
