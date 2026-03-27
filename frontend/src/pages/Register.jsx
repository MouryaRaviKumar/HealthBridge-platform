import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [role, setRole] = useState('PATIENT');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', 
        // Patient specific
        age: '', gender: '', bloodgroup: '', contactNumber: '',
        // Doctor specific
        department: '', experience: '', contactInfo: ''
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let endpoint = '';
            let payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            if (role === 'PATIENT') {
                endpoint = '/api/auth/register-patient';
                payload = { ...payload, 
                    age: Number(formData.age), 
                    gender: formData.gender, 
                    bloodgroup: formData.bloodgroup, 
                    contactNumber: formData.contactNumber 
                };
            } else if (role === 'DOCTOR') {
                endpoint = '/api/auth/register-doctor';
                payload = { ...payload, 
                    department: formData.department, 
                    experience: Number(formData.experience), 
                    contactInfo: formData.contactInfo 
                };
            } else {
                endpoint = '/api/auth/admin-register';
            }

            const res = await axios.post(endpoint, payload);
            
            // Auto login after register
            login({
                _id: res.data._id,
                name: res.data.name || formData.name,
                email: formData.email,
                role: role,
                token: res.data.token
            });

            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'DOCTOR') navigate('/doctor');
            else navigate('/patient');

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '3rem auto' }}>
            <div className="card">
                <h2 className="heading-2" style={{ textAlign: 'center' }}>Create Account</h2>
                
                {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label-field">Register As</label>
                        <select 
                            className="input-field" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="ADMIN">Admin (For Testing)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label-field">Full Name</label>
                        <input name="name" type="text" className="input-field" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="label-field">Email Address</label>
                        <input name="email" type="email" className="input-field" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label className="label-field">Password</label>
                        <input name="password" type="password" className="input-field" value={formData.password} onChange={handleChange} required />
                    </div>

                    {role === 'PATIENT' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="label-field">Age</label>
                                    <input name="age" type="number" className="input-field" value={formData.age} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="label-field">Gender</label>
                                    <select name="gender" className="input-field" value={formData.gender} onChange={handleChange} required>
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="label-field">Blood Group</label>
                                    <select name="bloodgroup" className="input-field" value={formData.bloodgroup} onChange={handleChange} required>
                                        <option value="">Select...</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="label-field">Contact Number</label>
                                    <input name="contactNumber" type="text" className="input-field" value={formData.contactNumber} onChange={handleChange} required />
                                </div>
                            </div>
                        </>
                    )}

                    {role === 'DOCTOR' && (
                        <>
                            <div className="form-group">
                                <label className="label-field">Department</label>
                                <select name="department" className="input-field" value={formData.department} onChange={handleChange} required>
                                    <option value="">Select...</option>
                                    {[
                                        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
                                        'Gynecology', 'Oncology', 'ENT', 'Psychiatry', 'General Medicine'
                                    ].map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="label-field">Experience (Years)</label>
                                    <input name="experience" type="number" className="input-field" value={formData.experience} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="label-field">Contact Info</label>
                                    <input name="contactInfo" type="text" className="input-field" value={formData.contactInfo} onChange={handleChange} required />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
