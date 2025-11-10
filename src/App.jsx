import React, { useState } from "react";
import Login from "./pages/login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  // Called when login succeeds
  const handleLogin = () => setLoggedIn(true);

  // Called when logout happens
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setLoggedIn(false);
  };

  // Toggle between login and register
  const toggleRegister = () => setShowRegister((prev) => !prev);

  if (loggedIn) {
   
    return <HomePage onLogout={handleLogout} />;
  } else {
    return showRegister ? (
      <Register onRegisterSuccess={toggleRegister} />
    ) : (
      <Login onLogin={handleLogin} onRegister={toggleRegister} />
    );
  }
}

export default App;
