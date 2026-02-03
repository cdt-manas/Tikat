import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import api from '../api/axios';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Verify OTP with Supabase
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup'
            });

            if (verifyError) throw verifyError;

            // If success, user is logged in automatically by Supabase client
            navigate('/');
        } catch (err) {
            console.error('OTP verification error:', err);
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email
            });

            if (resendError) throw resendError;
            setMessage('New OTP sent! Check your email.');
        } catch (err) {
            setError(err.message || 'Failed to resend OTP');
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
