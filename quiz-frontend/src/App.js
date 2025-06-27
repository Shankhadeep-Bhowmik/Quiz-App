import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';

function App() {
  return (
   <>
     <div className='App'>
      <Routes>
        
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/profile' element={<Profile/>}/>
        <Route path='*' element={<div><h1>404 Not Found!</h1></div>}/>
      </Routes>
     </div>
   </>
  );
}

export default App;
