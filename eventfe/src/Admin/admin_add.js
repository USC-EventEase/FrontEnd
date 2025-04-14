import React, { useState } from "react";
import "./admin_add.css"; // Create the CSS file for styling

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can call the API to create the admin or handle the logic
    console.log("New Admin Created", { username, password });

    // Optionally reset form
    setUsername("");
    setPassword("");
  };

  return (
    <div className="admin-page">
      <header>

      </header>

      {/* Admin Form */}
      <section className="admin-form">
        <h2>Add New Admin</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </section>
    </div>
  );
};

export default Admin;
