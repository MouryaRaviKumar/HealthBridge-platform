import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Booking form state
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [bookingMsg, setBookingMsg] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [appRes, recRes, docRes] = await Promise.all([
                axios.get('/api/patient/appointments/my'),
                axios.get('/api/patient/medical-records/my'),
                axios.get('/api/patient/doctors')
            ]);
            setAppointments(Array.isArray(appRes.data) ? appRes.data : []);
            setRecords(Array.isArray(recRes.data) ? recRes.data : []);
            setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        setBookingMsg('');
        try {
            await axios.post('/api/patient/appointments', {
                doctor: selectedDoctor,
                appointmentDate: date,
                timeSlot
            });
            setBookingMsg('Appointment booked successfully!');
            fetchDashboardData();
            // Reset form
            setSelectedDoctor('');
            setDate('');
            setTimeSlot('');
        } catch (err) {
            setBookingMsg('Error: ' + (err.response?.data?.message || 'Failed to book'));
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="heading-1">Patient Dashboard</h1>
            {error && <div className="error-text">{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', marginTop: '1rem' }}>
                
                {/* Book Appointment Section */}
                <div className="card">
                    <h2 className="heading-2">Book an Appointment</h2>
                    {bookingMsg && <div style={{ marginBottom: '1rem', color: bookingMsg.includes('Error') ? 'var(--error)' : 'var(--success)' }}>{bookingMsg}</div>}
                    <form onSubmit={handleBookAppointment}>
                        <div className="form-group">
                            <label className="label-field">Select Doctor</label>
                            <select 
                                className="input-field" 
                                value={selectedDoctor} 
                                onChange={(e) => setSelectedDoctor(e.target.value)} 
                                required
                            >
                                <option value="">Select a Doctor</option>
                                {doctors.map(doc => (
                                    <option key={doc._id} value={doc._id}>
                                        Dr. {doc.name} - {doc.department} ({doc.experience} Yrs)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="label-field">Date</label>
                            <input 
                                type="date" 
                                className="input-field" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="label-field">Time Slot</label>
                            <select 
                                className="input-field" 
                                value={timeSlot} 
                                onChange={(e) => setTimeSlot(e.target.value)} 
                                required
                            >
                                <option value="">Select a Time Slot</option>
                                {[
                                    '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
                                    '11:00-11:30', '11:30-12:00', '14:00-14:30', '14:30-15:00',
                                    '15:00-15:30', '15:30-16:00'
                                ].map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Book Appointment
                        </button>
                    </form>
                </div>

                {/* Extracted My Appointments & Records */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card">
                        <h2 className="heading-2">My Appointments</h2>
                        {appointments.length === 0 ? <p className="text-muted">No appointments found.</p> : (
                            <ul style={{ listStyle: 'none' }}>
                                {appointments.map(app => (
                                    <li key={app._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                                        <strong>Dr. {app.doctor?.name}</strong> <br/>
                                        <span className="text-muted">
                                            {new Date(app.appointmentDate).toLocaleDateString()} at {app.timeSlot}
                                        </span>
                                        <br/>Status: {app.status}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="card">
                        <h2 className="heading-2">Medical Records</h2>
                        {records.length === 0 ? <p className="text-muted">No medical records found.</p> : (
                            <ul style={{ listStyle: 'none' }}>
                                {records.map(rec => (
                                    <li key={rec._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                                        <strong>Diagnosis:</strong> {rec.diagnosis} <br/>
                                        <strong>Prescription:</strong> {rec.prescriptions} <br/>
                                        <span className="text-muted">By Dr. {rec.doctor?.name} on {new Date(rec.createdAt).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
