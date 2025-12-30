import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navigation = () => {
    const { user, logout } = useAuth();
    const [q, setQ] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav('/');
    };

    const doSearch = (e) => {
        e.preventDefault();
        nav(`/?q=${encodeURIComponent(q)}`);
        setQ('');
    };

    return (
        <nav className="navbar">
            <div className="site-container navbar-content">
                <Link to="/" className="nav-brand">LMS</Link>

                <form onSubmit={doSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="search-input"
                    />
                </form>

                <div className="nav-right">
                    {user ? (
                        <>
                            <Link to="/profile" className="nav-user">
                                <span className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</span>
                                <span className="user-name">{user.username || user.email}</span>
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline-primary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-outline-primary">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    ☰
                </button>
            </div>

            {mobileOpen && (
                <div className="mobile-menu">
                    {user && (
                        <>
                            <Link to="/profile" className="mobile-link">Profile</Link>
                            <button onClick={handleLogout} className="mobile-link">Logout</button>
                        </>
                    )}
                    {!user && (
                        <>
                            <Link to="/login" className="mobile-link">Login</Link>
                            <Link to="/register" className="mobile-link">Sign up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navigation;
