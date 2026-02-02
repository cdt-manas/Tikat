import { Link } from 'react-router-dom';

const PaymentFailure = () => {
    return (
        <div className="container fade-in" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#fbbf24' }}>Payment Cancelled</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '40px' }}>You cancelled the payment or something went wrong.</p>

            <Link to="/" className="btn">Try Again</Link>
        </div>
    );
};

export default PaymentFailure;
