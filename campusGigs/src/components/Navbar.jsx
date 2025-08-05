import React, { useState, useEffect } from 'react';
import logo from "../images/Black Retro Motorcycle Circle Logo (1).png";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/sign-in'); // Redirect to login page after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const checkForToken = () => {
    const token = Cookies.get("token");
    setIsSignedIn(!!token);
    setAuthChecked(true);
  };

  useEffect(() => {
    checkForToken();
    const intervalId = setInterval(checkForToken, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.querySelector(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: "/", title: "Home", fontWeight: "font-bold" },
    { id: "#jobs-section", title: "Part-Time Jobs", fontWeight: "font-bold" }
  ];

  if (!authChecked) return null;

  return (
    <>
      <header className="bg-gold">
        <nav className="flex items-center justify-between p-4">
          <a href="/" className="flex items-center gap-2 text-2xl nav-link">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={logo}
              alt="Logo"
            />
            <span className="text-4xl font-bold text-maroon-700 ml-1">MSU CampusGigs</span>
          </a>
          <div className="hidden md:flex gap-12">
            <ul className="flex gap-12">
              {!isSignedIn && navItems.map(({ path, title, id, fontWeight }) => (
                <li key={path || id} className="text-lg text-gray-700">
                  {id ? (
                    <a
                      href={id}
                      onClick={(e) => handleScrollToSection(e, id)}
                      className={`hover:text-maroon-700 ${fontWeight}`}
                    >
                      {title}
                    </a>
                  ) : (
                    <NavLink
                      to={path}
                      className={`hover:text-maroon-700 ${fontWeight}`}
                      activeClassName="active"
                    >
                      {title}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
            <div className="text-lg font-medium space-x-5 hidden lg:block">
              {!isSignedIn ? (
                <>
                  <Link to="/sign-in" className="py-2 px-5 border rounded bg-maroon-700 text-yellow-300">Sign In</Link>
                  <Link to="/sign-up" className="py-2 px-5 border rounded bg-maroon-700 text-yellow-300">Sign Up</Link>
                </>
              ) : (
                <p
                  className="text-lg font-medium mr-2 ml-2 cursor-pointer py-2 px-5 border rounded bg-maroon-700 text-yellow-300"
                  onClick={confirmLogout}
                >
                  Logout <i className="fas fa-sign-out-alt ml-1"></i>
                </p>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={handleMenuToggle} className="text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden bg-gold">
            <ul className="flex flex-col items-end gap-4 py-4 pr-4">
              {!isSignedIn && navItems.map(({ path, title, id, fontWeight }) => (
                <li key={path || id} className="text-lg text-gray-700">
                  {id ? (
                    <a
                      href={id}
                      onClick={(e) => handleScrollToSection(e, id)}
                      className={`hover:text-maroon-700 ${fontWeight}`}
                    >
                      {title}
                    </a>
                  ) : (
                    <NavLink
                      to={path}
                      className={`hover:text-maroon-700 ${fontWeight}`}
                      activeClassName="active"
                      onClick={handleMenuToggle}
                    >
                      {title}
                    </NavLink>
                  )}
                </li>
              ))}
              <div className="text-lg font-medium space-x-5">
                {!isSignedIn ? (
                  <>
                    <Link to="/sign-in" className="py-2 px-5 border rounded bg-maroon-700 text-white" onClick={handleMenuToggle}>Sign In</Link>
                    <Link to="/sign-up" className="py-2 px-5 border rounded bg-maroon-700 text-white" onClick={handleMenuToggle}>Sign Up</Link>
                  </>
                ) : (
                  <p
                    className="text-lg font-medium mr-2 ml-2 cursor-pointer py-2 px-5 border rounded bg-maroon-700 text-yellow-300"
                    onClick={confirmLogout}
                  >
                    Logout <i className="fas fa-sign-out-alt ml-1"></i>
                  </p>
                )}
              </div>
            </ul>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="btn btn-confirm"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>

          <style jsx>{`
            .modal-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background-color: rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }
            .modal {
              background: white;
              padding: 24px;
              border-radius: 8px;
              max-width: 400px;
              width: 90%;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
              text-align: center;
            }
            .modal h2 {
              margin-bottom: 16px;
            }
            .modal-buttons {
              display: flex;
              justify-content: center;
              gap: 16px;
              margin-top: 24px;
            }
            .btn {
              padding: 10px 20px;
              border-radius: 5px;
              border: none;
              cursor: pointer;
              font-weight: 600;
              font-size: 14px;
              transition: background-color 0.3s ease;
            }
            .btn-confirm {
              background-color: #4caf50;
              color: white;
            }
            .btn-confirm:hover {
              background-color: #388e3c;
            }
            .btn-cancel {
              background-color: #9e9e9e;
              color: white;
            }
            .btn-cancel:hover {
              background-color: #757575;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Navbar;
