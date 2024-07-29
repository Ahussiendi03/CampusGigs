import React, { useState } from 'react';
import logo from "../images/Black Retro Motorcycle Circle Logo (1).png";
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { path: "/", title: "Home", fontWeight: "font-bold" },
        { path: "/About", title: "About Us", fontWeight: "font-semibold" },
        { path: "/Job", title: "Job", fontWeight: "font-semibold" },
        { path: "/Contact", title: "Contact", fontWeight: "font-semibold" },
    ];

    return (
        <header className="bg-gold">
            <nav className="flex items-center justify-between p-4">
                <a href='/' className="flex items-center gap-2 text-2xl nav-link">
                    <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={logo}
                        alt="Logo"
                    />
                    <span className="text-4xl font-bold text-maroon-700 ml-1">MSU CampusGigs</span>
                </a>
                <div className="hidden md:flex gap-12">
                    <ul className="flex gap-12">
                        {navItems.map(({ path, title, fontWeight }) => (
                            <li key={path} className="text-lg text-gray-700">
                                <NavLink
                                    to={path}
                                    className={`hover:text-maroon-700 ${fontWeight}`}
                                    activeClassName="active"
                                >
                                    {title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="text-lg font-medium space-x-5 hidden lg:block">
                        <Link to="/sign-in" className="py-2 px-5 border rounded bg-maroon-700 text-yellow-300">Sign In</Link>
                        <Link to="/sign-up" className="py-2 px-5 border rounded bg-maroon-700 text-yellow-300">Sign Up</Link>
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
                        {navItems.map(({ path, title, fontWeight }) => (
                            <li key={path} className="text-lg text-gray-700">
                                <NavLink
                                    to={path}
                                    className={`hover:text-maroon-700 ${fontWeight}`}
                                    activeClassName="active"
                                    onClick={handleMenuToggle}
                                >
                                    {title}
                                </NavLink>
                            </li>
                        ))}
                        <div className="text-lg font-medium space-x-5">
                            <Link to="/sign-in" className="py-2 px-5 border rounded bg-maroon-700 text-white" onClick={handleMenuToggle}>Sign In</Link>
                            <Link to="/sign-up" className="py-2 px-5 border rounded bg-maroon-700 text-white" onClick={handleMenuToggle}>Sign Up</Link>
                        </div>
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Navbar;