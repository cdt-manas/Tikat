import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await register(formData.name, formData.email, formData.password);
            // Redirect to OTP verification instead of home
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <h2 className="auth-title">Create Account</h2>
            {error && <div className="error-msg">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min. 6 characters"
                        required
                        minLength="6"
                    />
                </div>
                <button type="submit" className="btn btn-block" disabled={isLoading} style={{ marginTop: '32px' }}>
                    {isLoading ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in here</Link>
            </div>
        </div>
    );
};

export default Register;
