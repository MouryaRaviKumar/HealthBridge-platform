import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [role, setRole] = useState('PATIENT');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = role === 'ADMIN' ? '/api/auth/admin-login' : '/api/auth/login';
            const res = await axios.post(endpoint, { email, password });
            
            // Note: If /auth/login is used but the user is DOCTOR or PATIENT, 
            // the server returns role: 'DOCTOR' or 'PATIENT'.
            // The selected role on frontend just helps point to the correct endpoint or validate.
            if (role !== 'ADMIN' && res.data.role !== role) {
                // Soft check
                console.warn(`Logged in as ${res.data.role} instead of selected ${role}`);
            }

            login(res.data);

            if (res.data.role === 'ADMIN') navigate('/admin');
            else if (res.data.role === 'DOCTOR') navigate('/doctor');
            else navigate('/patient');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <h2 className="heading-2" style={{ textAlign: 'center' }}>Sign In</h2>
                
                {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label-field">Role</label>
                        <select 
                            className="input-field" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label-field">Email Address</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            placeholder="mail@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="label-field">Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
