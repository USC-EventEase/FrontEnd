import React, { createContext, useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import './login.css'
import { FormContextLogin } from "./FormContextLogin";
import { login } from "../api/auth";
import Cookies from 'js-cookie';

const preventRefresh = (e) => {
    e.preventDefault();
};


const Login = () => {
    const { formDataLogin, setFormDataLogin} = useContext(FormContextLogin);
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
        setFormDataLogin(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
		setError(null);

		try {
			const response = await login(formDataLogin.email, formDataLogin.password);

			if(response.ok) {
				const data = response.data;
				const { token, userId, type} = data;
				
				Cookies.set('token', token);
				Cookies.set('userId', userId);
				Cookies.set('type', type);

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
        <div className="wrapper signIn">

			<div className="form">
				<div className="heading">LOGIN</div>

				{showError && (
					<p style={{ color: "red", marginBottom: "1rem", fontWeight: "bold" }}>
						{errorText}
					</p>
				)}

				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username">Email</label>
						<input type="text" id="name" name="email" value={formDataLogin.email} placeholder="Enter your email" onChange={handleChange} required />
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password" value={formDataLogin.password} placeholder="Enter your password" onChange={handleChange} required/>
					</div>
					<button type="submit">
						Submit
					</button>
				</form>
				<p>
					Don't have an account ? <Link to="/signup"> Sign Up </Link>
				</p>
			</div>
		</div>
    )
}

export default Login;