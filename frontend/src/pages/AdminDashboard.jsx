import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [docsRes, patsRes] = await Promise.all([
                axios.get('/api/admin/doctors'),
                axios.get('/api/admin/patients')
            ]);
            
            // The paginated middleware returns { total, page, limit, totalPages, data: [...] }
            setDoctors(docsRes.data.data || []);
            setPatients(patsRes.data.data || []);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveDoctor = async (doctorId) => {
        try {
            await axios.put(`/api/admin/doctors/${doctorId}/approve`);
            fetchData();
        } catch (err) {
            alert('Failed to approve doctor');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="heading-1">Admin Dashboard</h1>
            {error && <div className="error-text">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
                <div className="card">
                    <h2 className="heading-2">Manage Doctors</h2>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                                <th style={{ padding: '0.75rem 0' }}>Name</th>
                                <th>Department</th>
                                <th>Experience</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '0.75rem 0' }}>{doc.name}</td>
                                    <td>{doc.department}</td>
                                    <td>{doc.experience} Years</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.875rem',
                                            backgroundColor: doc.status === 'working' ? 'var(--success)' : 'var(--warning)',
                                            color: '#fff'
                                        }}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td>
                                        {doc.status === 'approval pending' && (
                                            <button 
                                                className="btn-primary" 
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                onClick={() => handleApproveDoctor(doc._id)}
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h2 className="heading-2">Patients List</h2>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                                <th style={{ padding: '0.75rem 0' }}>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(pat => (
                                <tr key={pat._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '0.75rem 0' }}>{pat.name}</td>
                                    <td>{pat.age}</td>
                                    <td>{pat.gender}</td>
                                    <td>{pat.contactNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
