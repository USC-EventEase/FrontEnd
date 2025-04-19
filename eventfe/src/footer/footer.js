import React from "react";
import "./footer.css";  // Add CSS file for styling

const Footer = () => {
  return (
    <div className="footer">
      <footer className="flexSB">
        <p>&copy; 2025 EventEase. All Rights Reserved.</p>
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
