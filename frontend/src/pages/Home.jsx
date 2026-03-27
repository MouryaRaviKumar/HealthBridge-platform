import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 className="heading-1">Welcome to HealthBridge</h1>
            <p className="heading-2 text-muted" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', fontWeight: 400 }}>
                A secure healthcare appointment & medical records platform. 
                Manage your hospital visits with ease and elegance.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
                <Link to="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Get Started as a Patient
                </Link>
                <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Login to Account
                </Link>
            </div>
        </div>
    );
};

export default Home;
