import React, { createContext, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import './login.css'
import { FormContextLogin } from "./FormContextLogin";

const preventRefresh = (e) => {
    e.preventDefault();
};


const Login = () => {
    const { formDataLogin, setFormDataLogin} = useContext(FormContextLogin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataLogin(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/admin_add');
    };

    return (
        <div className="wrapper signIn">
			{/* <div className="illustration">
				<img src="https://source.unsplash.com/random" alt="illustration" />
			</div> */}
			<div className="form">
				<div className="heading">LOGIN</div>
				<form>
					<div>
						<label htmlFor="username">Username</label>
						<input type="text" id="name" name="username" value={formDataLogin.username} placeholder="Enter your username" onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input type="text" id="password" name="password" value={formDataLogin.password} placeholder="Enter your password" onChange={handleChange} />
					</div>
					<button type="submit" onClick={handleSubmit}>
						Submit
					</button>
				</form>
				<p>
					Don't have an account ? <Link to="/signup"> Sign In </Link>
				</p>
			</div>
		</div>
    )
}

export default Login;