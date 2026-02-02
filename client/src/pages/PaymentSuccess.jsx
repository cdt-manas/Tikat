import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [bookingId, setBookingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const finalizeBooking = async () => {
            const sessionId = searchParams.get('session_id');

            if (!sessionId) {
                setStatus('error');
                return;
            }

            try {
                // Secure Confirmation:
                // Send session_id to backend. Backend verifies with Stripe and creates booking.
                const { data } = await api.post('/bookings/confirm', { session_id: sessionId });

                if (data.success) {
                    setBookingId(data.data._id);
                    setStatus('success');
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };

        finalizeBooking();
    }, [searchParams]);

    return (
        <div className="container fade-in" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>

            {status === 'processing' && (
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Processing Payment...</h2>
                    <p>Please wait while we confirm your tickets.</p>
                </div>
            )}

            {status === 'success' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#4ade80' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '40px' }}>Your tickets have been booked successfully.</p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/my-bookings" className="btn">View My Tickets</Link>
                        <Link to="/" className="btn btn-secondary">Back to Home</Link>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#ef4444' }}>Booking Failed</h2>
                    <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '32px' }}>
                        We received your payment but couldn't finalize the booking.
                        <br />Please contact support with your session ID: {searchParams.get('session_id')}
                    </p>
                    <Link to="/" className="btn btn-secondary">Return Home</Link>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;
