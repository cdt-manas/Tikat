import { useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [restored, setRestored] = useState(false);
    const [error, setError] = useState('');
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await api.put(`/auth/resetpassword/${resetToken}`, { password });
            setRestored(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token');
        }
    };

    if (restored) {
        return (
            <div className="auth-container" style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#46d369', marginBottom: '20px' }}>Success!</h2>
                <p>Password updated correctly. Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="auth-container">
            <h2 className="auth-title">Reset Password</h2>
            {error && <div className="error-msg">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <button type="submit" className="btn btn-block">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
