import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Welcome Back</h2>
            {error && <div className="error-msg">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Forgot Password?</Link>
                </div>
                <button type="submit" className="btn btn-block" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                New to Tikat? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create an account</Link>
            </div>
        </div>
    );
};

export default Login;
