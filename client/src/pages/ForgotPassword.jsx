import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { data } = await api.post('/auth/forgotpassword', { email });
            setMessage('Password reset link sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Forgot Password</h2>
            {message && <div style={{ padding: '10px', background: 'rgba(70, 211, 105, 0.15)', border: '1px solid #46d369', color: '#46d369', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}
            {error && <div className="error-msg">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <button type="submit" className="btn btn-block" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login" className="nav-link" style={{ color: 'var(--primary-color)' }}>Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
