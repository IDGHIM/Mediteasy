import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <div className="navbar__logo">
          {/* Logo image ou SVG généré */}
          <img
            src="/assets/logo/logo_app.png"
            alt="MéditEasy"
            className="navbar__logo-image"
          />
          <span className="navbar__logo-text">MéditEasy</span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
