import React, {useState} from 'react';
import './Signup.css';
import googleLogo from '../assets/new_google_logo.jpg';
 
const SignUp = () => { 

  //  stores all the things the user types into the form
  const [data, setData] = useState({
    username:'',
    email:'',
    password:'',
    confirm_password:''
  });

  const changeValues = (event) => {
  const {name, value} = event.target;
  setData(oldData => ({
    ...oldData, [name]:value
  }));
  };

  // const [showPassword, setShowPassword] = useState(false);

  // const togglePassword = () => {
  //   setShowPassword(!showPassword);
  // }

  const clickSubmit = (event) => {
    event.preventDefault();
    console.log('Form Submitted: ',data);
  };

  return(
    <div className='container'>
      <div className='signup-container'>
        <h2>Create Account</h2>
        <p className='p1'>Unlock your knowledge by participating our Quiz</p>
        <form onSubmit={clickSubmit} className='signup-form'>
          <div className='formGroup'>
            <label htmlFor='username'>Username</label>
            <input type='text' id='username' name='username' value={data.username} onChange={changeValues} placeholder='Enter username' required />
          </div>

          <div className='formGroup'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' value={data.email} onChange={changeValues} placeholder='Enter email' required />
          </div>

          <div className='formGroup'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' value={data.password} onChange={changeValues} placeholder='Enter password' required />
          </div>

          <div className='formGroup'>
            <label htmlFor='confirm_password'>Confirm-Password</label>
            <input type='password' id='confirm_password' name='confirm_password' value={data.confirm_password} onChange={changeValues} placeholder='Confirm password' required />
          </div>

          {/* <div className='hidePassword'>
            <input type="checkbox" id='hidePassword' name='hidePassword'  onChange={togglePassword}/>
            <label htmlFor="hidePassword">Show Password</label>
          </div> */}

          <button className='signup-btn' type='submit'>Sign Up</button>

          <div className='divider'>
            <hr className='hr1'/>
            <span>or</span>
            <hr className="hr2"/>
          </div>

          <button className='signup-google'>
            <img src={googleLogo} alt="google-logo" className='google-logo'/>
             Sign Up with Google
          </button>
        </form>
      </div>
    </div>
  );


// This is a function called every time someone types in the form (like typing their name).
};  // End of main function
export default SignUp;