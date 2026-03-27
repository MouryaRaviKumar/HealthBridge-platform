import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Medical Record Form State
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [dosandonts, setDosandonts] = useState('');
    const [recordMsg, setRecordMsg] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/doctor/appointments');
            setAppointments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError('Failed to fetch appointments.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRecord = async (e) => {
        e.preventDefault();
        setRecordMsg('');
        if (!selectedAppointment) return;

        try {
            await axios.post(`/api/doctor/${selectedAppointment._id}/medical-records`, {
                diagnosis,
                prescriptions: prescription, // Mapping frontend 'prescription' to backend 'prescriptions'
                advice: dosandonts // Mapping frontend 'dosandonts' to backend 'advice'
            });
            setRecordMsg('Medical record saved successfully!');
            // Reset form
            setSelectedAppointment(null);
            setDiagnosis('');
            setPrescription('');
            setDosandonts('');
        } catch (err) {
            setRecordMsg('Error: ' + (err.response?.data?.message || 'Failed to create record'));
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="heading-1">Doctor Dashboard</h1>
            {error && <div className="error-text">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', marginTop: '1rem' }}>
                
                {/* Appointments List */}
                <div className="card">
                    <h2 className="heading-2">Assigned Appointments</h2>
                    {appointments.length === 0 ? <p className="text-muted">No appointments found.</p> : (
                        <ul style={{ listStyle: 'none' }}>
                            {appointments.map(app => (
                                <li key={app._id} style={{ 
                                    padding: '1rem', 
                                    border: '1px solid var(--border-light)', 
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    backgroundColor: selectedAppointment?._id === app._id ? 'var(--bg-secondary)' : 'transparent'
                                }}>
                                    <strong>Date:</strong> {new Date(app.appointmentDate).toLocaleDateString()} at {app.timeSlot} <br/>
                                    <strong>Status:</strong> {app.status} <br/>
                                    <button 
                                        className="btn-secondary" 
                                        style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        onClick={() => {
                                            setSelectedAppointment(app);
                                            setRecordMsg('');
                                        }}
                                    >
                                        Add Medical Record
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Medical Record Form */}
                <div className="card">
                    <h2 className="heading-2">Create Medical Record</h2>
                    {recordMsg && <div style={{ marginBottom: '1rem', color: recordMsg.includes('Error') ? 'var(--error)' : 'var(--success)' }}>{recordMsg}</div>}
                    
                    {!selectedAppointment ? (
                        <p className="text-muted">Select an appointment from the list to add a record.</p>
                    ) : (
                        <form onSubmit={handleCreateRecord}>
                            <p style={{ marginBottom: '1rem', fontWeight: 500 }}>
                                Selected Visit: {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                            </p>
                            <div className="form-group">
                                <label className="label-field">Diagnosis</label>
                                <textarea 
                                    className="input-field" 
                                    rows="3"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label-field">Prescription</label>
                                <textarea 
                                    className="input-field" 
                                    rows="3"
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label-field">Do's and Don'ts</label>
                                <textarea 
                                    className="input-field" 
                                    rows="2"
                                    value={dosandonts}
                                    onChange={(e) => setDosandonts(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Record</button>
                                <button type="button" className="btn-secondary" onClick={() => setSelectedAppointment(null)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
