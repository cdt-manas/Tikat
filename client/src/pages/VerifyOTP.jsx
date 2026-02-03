import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login: authLogin } = useAuth();

    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('Verifying OTP:', { email, otp });

        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            console.log('OTP verification success:', data);

            if (data.token) {
                await authLogin(data.token);
                navigate('/');
            } else {
                setError('No token received from server');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'OTP verification failed';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await api.post('/auth/resend-otp', { email });
            setMessage('New OTP sent! Check your email (or server console in dev mode).');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Verify Your Email</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>

            {/* DEMO MODE ALERT */}
            {location.state?.demoOtp && (
                <div style={{
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    color: '#fbbf24',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    <strong>🚧 DEMO MODE 🚧</strong><br />
                    Email delivery may be blocked by cloud provider.<br />
                    Use OTP: <strong style={{ color: 'white', fontSize: '1.1rem', marginLeft: '5px' }}>{location.state.demoOtp}</strong>
                </div>
            )}

            {error && <div className="error-msg">{error}</div>}
            {message && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#4ade80',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '24px',
                    fontSize: '0.9rem'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>OTP Code</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength="6"
                        required
                        style={{
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            letterSpacing: '0.5rem',
                            fontWeight: '600'
                        }}
                    />
                    <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '8px' }}>
                        {otp.length}/6 digits entered
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-block"
                    disabled={loading || otp.length !== 6}
                    style={{
                        opacity: (loading || otp.length !== 6) ? 0.5 : 1,
                        cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Verifying...' : otp.length === 6 ? 'Verify OTP ✓' : 'Enter 6-Digit OTP'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResend}
                        disabled={loading}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '0.9rem',
                            padding: 0
                        }}
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOTP;
