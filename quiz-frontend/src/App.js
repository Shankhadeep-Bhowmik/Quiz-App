import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Quiz from './components/Quiz';

function App() {
  return (
   <>
     <div className='App'>
      <Routes>
        
          <Route path='/' element={<Home/>}/>
          <Route path='/quiz' element={<Quiz/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        <Route path='*' element={<div><h1>404 Not Found!</h1></div>}/>
      </Routes>
     </div>
   </>
  );
}

export default App;
