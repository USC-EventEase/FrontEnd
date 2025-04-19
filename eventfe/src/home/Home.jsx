import React from "react";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="mission-box">
        <h1>Welcome to EventEase</h1>
        <p>
          At Event Ease, our mission is to make event planning effortless.
          Whether you're booking a venue, organizing an intimate gathering, or
          hosting a large celebration, we streamline the process—connecting you
          with the right people, places, and services to bring your vision to
          life. With simplicity, clarity, and reliability at our core, we're
          here to turn your moments into milestones—stress-free.
        </p>
      </div>
      <div className="image-box">
        <div className="logo-wrapper">
          <img
            src="/navbar_logo.png"
            alt="EventEase logo"
            className="background-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
