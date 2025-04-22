import React, { createContext, useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { FormContextSignup } from "./FormContextSignup";
import { signup } from "../api/auth";

const preventRefresh = (e) => {
  e.preventDefault();
};


const Signup = () => {
  const { formDataSignup, setFormDataSignup } = useContext(FormContextSignup);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataSignup(prevData => ({
        ...prevData,
        [name]: value
    }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
  
      try {
        const response = await signup(formDataSignup.name, formDataSignup.email, formDataSignup.password, formDataSignup.type);
  
        if(response.ok) {
          console.log("Signed up successfully");
          navigate('/');
        }

        else {
          const errorMessage = response.data.message;
          setErrorText(errorMessage);
          setShowError(true);
          
        }
        
      } catch (err) {
        console.error("Login Error: ", err.message);
        setError(err.message);
      }
          
  };

  return (
    <div className="wrapper signUp">

      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>

        {showError && (
					<p style={{ color: "red", marginBottom: "1rem", fontWeight: "bold" }}>
						{errorText}
					</p>
				)}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formDataSignup.name} placeholder="Enter your name" onChange={handleChange} required/>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" value={formDataSignup.email} placeholder="Enter your email" onChange={handleChange} required/>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formDataSignup.password} placeholder="Enter your password" onChange={handleChange} required/>
          </div>
          <div>
            <label htmlFor="type">Account Type</label>
            <select id="type" name="type" value={formDataSignup.type} onChange={handleChange} required>
              <option value="">Select an option</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">
            Submit
          </button>
          <h2 align="center" className="or">
            OR
          </h2>
        </form>
        <p>
          Have an account ? <Link to="/"> Login </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup;
