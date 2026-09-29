import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const closeNav = () => {
    setIsNavCollapsed(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center me-4" to="/" onClick={closeNav}>
          <div className="navbar-brand-icon me-2">
            <i className="fas fa-briefcase"></i>
          </div>
          <div>
            <span className="fw-bold fs-5 tracking-tight text-white">JobPortal</span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none px-2 py-1"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 py-2 py-lg-0 gap-lg-1">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link nav-link-custom d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                to="/jobs"
                onClick={closeNav}
              >
                <i className="fas fa-compass me-2"></i>
                <span>Explore Jobs</span>
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link nav-link-custom d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                  to="/applications"
                  onClick={closeNav}
                >
                  <i className="fas fa-file-contract me-2"></i>
                  <span>My Applications</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Items */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 pt-2 pt-lg-0  border-secondary border-opacity-25 border-top-0-lg">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link text-white d-flex align-items-center py-2 px-3 rounded ${
                        isActive ? 'bg-white bg-opacity-10' : ''
                      }`
                    }
                    to="/profile"
                    onClick={closeNav}
                  >
                    <div className="user-avatar-badge me-2">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="d-flex flex-column text-start">
                      <span className="fw-semibold text-white small lh-1">
                        {user?.name || 'Account'}
                      </span>
                      <span className="mt-1" style={{ fontSize: '0.72rem', color: "gray" }}>
                        Candidate Profile
                      </span>
                    </div>
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <button
                    className="btn btn-outline-light btn-sm px-3 py-2 rounded-pill d-flex align-items-center"
                    onClick={() => {
                      closeNav();
                      handleLogout();
                    }}
                    style={{ borderColor: 'rgba(255, 255, 255, 0.25)', fontSize: '0.85rem' }}
                  >
                    <i className="fas fa-sign-out-alt me-1 text-danger"></i>
                    <span>Log Out</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link nav-link-custom ${isActive ? 'active' : ''}`
                    }
                    to="/login"
                    onClick={closeNav}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i> Sign In
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-primary btn-sm px-3 rounded-pill text-white fw-semibold d-flex align-items-center"
                    to="/register"
                    onClick={closeNav}
                  >
                    <i className="fas fa-user-plus me-1 small"></i>
                    <span>Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
