import React from "react";
import "./footer.css";  // Add CSS file for styling

const Footer = () => {
  return (
    <div className="footer">
      <footer className="flexSB">
        <p>&copy; 2025 EventEase. All Rights Reserved.</p>
        <div className="social-links">
          {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> */}
        </div>
        <df-messenger
        intent="WELCOME"
        chat-title="TickeTron"
        agent-id="9c202571-f2ca-42ed-892e-c5a9044005db"
        language-code="en"
      ></df-messenger>
      </footer>
    </div>
  );
};

export default Footer;
