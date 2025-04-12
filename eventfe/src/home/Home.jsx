import React from "react";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="mission-box">
        <h1>Welcome to EventEase</h1>
        <p>
          EventEase is your one-stop platform for discovering and attending
          events you care about. Our mission is to make event participation
          seamless and enjoyable — whether you're a student, a fan, or an
          organizer.
        </p>
      </div>
      <div className="image-box">
        <img
          src="/assets/home-background.jpg"
          alt="EventEase concept"
          className="background-image"
        />
      </div>
    </div>
  );
};

export default Home;
