import React, { useState, useEffect } from 'react';
import logo from "../images/Black Retro Motorcycle Circle Logo (1).png";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        
        if (confirmLogout) {
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
        }
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
                top: section.offsetTop - 80, // Adjusted for navbar height
                behavior: "smooth"
            });
        }
        setIsMenuOpen(false); // Close mobile menu on click
    };

    const navItems = [
        { path: "/", title: "Home", fontWeight: "font-bold" },
        { id: "#about-us", title: "About Us" },
        { id: "#contact-us", title: "Contact Us" },
        { id: "#privacy-policy", title: "Privacy Policy" },
    ];

    if (!authChecked) return null;

    return (
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
                            <p className="text-lg font-medium mr-2 ml-2 cursor-pointer py-2 px-5 border rounded bg-maroon-700 text-yellow-300" onClick={handleLogout}>
                                Logout <i className="fas fa-sign-out-alt ml-1"></i></p>
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
                                <p className="text-lg font-medium mr-2 ml-2 cursor-pointer py-2 px-5 border rounded bg-maroon-700 text-yellow-300" onClick={handleLogout}>
                                    Logout <i className="fas fa-sign-out-alt ml-1"></i></p>
                            )}
                        </div>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Navbar;
