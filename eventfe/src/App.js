import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from './navbar/Navbar';
import Login from './login/Login';
import Signup from './login/Signup';
import { FormProviderLogin } from './login/FormContextLogin';


function App() {
  return (
    <>
    <FormProviderLogin>
      <Router>
              <Routes>
                  <Route path='/' element={<Login />} />
                  <Route path='/signup' element={<Signup />} />
                  <Route path='/home' element={<Navbar />} />
              </Routes>
      </Router>
    </FormProviderLogin>
    </>
  );
}

export default App;