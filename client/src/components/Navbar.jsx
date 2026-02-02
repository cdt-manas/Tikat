import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="logo">Tikat</Link>
                <ul className="nav-links">
                    {user ? (
                        <>
                            <li className="nav-link">Hey, {user.name}</li>
                            <li><Link to="/my-bookings" className="nav-link">My Bookings</Link></li>
                            {user.role === 'admin' && <li><Link to="/admin" className="nav-link">Admin Dashboard</Link></li>}
                            <li>
                                <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="nav-link">Login</Link></li>
                            <li><Link to="/register" className="btn" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
