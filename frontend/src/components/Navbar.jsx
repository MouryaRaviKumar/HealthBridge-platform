import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div>
                <Link to="/" className="heading-3" style={{ color: 'var(--accent-color)' }}>
                    HealthBridge
                </Link>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {!user ? (
                    <>
                        <Link to="/login" className="btn-secondary">Login</Link>
                        <Link to="/register" className="btn-primary">Register</Link>
                    </>
                ) : (
                    <>
                        {user.role === 'ADMIN' && <Link to="/admin" className="btn-secondary" style={{border: 'none'}}>Dashboard</Link>}
                        {user.role === 'DOCTOR' && <Link to="/doctor" className="btn-secondary" style={{border: 'none'}}>My Appointments</Link>}
                        {user.role === 'PATIENT' && <Link to="/patient" className="btn-secondary" style={{border: 'none'}}>My Records</Link>}
                        <span className="text-muted">Welcome, {user.name}</span>
                        <button onClick={handleLogout} className="btn-secondary">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
