import React,{useState} from 'react';
import './Login.css'

function Login(){
  const [formData, setFormData] = useState({
    email:'',
    password:''
  });

  function inputChange(event){
    const {name, value} = event.target;
    setFormData(oldData => ({
      ...oldData,
      [name]:value
    }));
  }

  function submitClick(event){
    event.preventDefault();
    console.log('Login Form Submitted: ',formData);
  }
  
  const [passwordVisisble, setPasswordVisible] = useState(false);

  function togglePassword(){
    setPasswordVisible(!passwordVisisble);
  }


  return(
    <div className='container'>
      <div className='form-container'>
        <h2 className='login-heading'>Login</h2>
        <form onSubmit={submitClick} className='form-box'>
          <div className='login-Group'>
            <label htmlFor='email'>Email </label>
            <input type='email' id='email' name='email' value={formData.email} onChange={inputChange} placeholder='Enter email' required/>
          </div>
          
          <div className='login-Group'>
            <label htmlFor='lpswd'>Password </label>
            <input type={passwordVisisble ? 'text' : 'password'} id='lpswd' name='password' value={formData.password} onChange={inputChange} placeholder='Enter password'/>
          </div>
          <div className='check-box'>
            <input type="checkbox" id='visibility' onClick={togglePassword}/>
            <label htmlFor='visibility'> Show Password</label>
          </div>
          <div className='login-btn-container'>
          <button type='submit' className='login-btn'>Sign in</button>
          </div>
          {/* <p className="para">Forgot <a href="#">password</a>?</p> */}
        </form>
      </div>
    </div>
  );
}
export default Login;