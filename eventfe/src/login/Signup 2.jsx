import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="wrapper signUp">
      {/* <div className="illustration">
        <img src="https://source.unsplash.com/random" alt="illustration" />
      </div> */}
      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>
        <form>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter you password" />
          </div>
          <button type="submit">Submit</button>
          <h2 align="center" class="or">
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
