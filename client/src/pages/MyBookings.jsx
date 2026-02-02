import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/my-bookings');
                setBookings(data.data);
            } catch (err) {
                setError('Failed to load your bookings. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>Loading tickets...</div>;

    if (error) return (
        <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
            <p className="error-msg">{error}</p>
            <button className="btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div className="container fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <h1 className="reveal" style={{ fontSize: '2.5rem', marginBottom: '32px', fontWeight: '800' }}>My Tickets</h1>

            {bookings.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    background: 'var(--surface-color)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎟️</div>
                    <h2 style={{ marginBottom: '16px' }}>No bookings yet</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>You haven't booked any movie tickets yet.</p>
                    <Link to="/" className="btn">Browse Movies</Link>
                </div>
            ) : (
                <div className="bookings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {bookings.map((booking) => (
                        <div key={booking._id} className="ticket-card reveal" style={{
                            background: 'var(--surface-color)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: 'var(--shadow-md)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Ticket Header (Movie Poster Blur) */}
                            <div style={{
                                height: '120px',
                                background: `url(${booking.show.movie.posterUrl}) center/cover no-repeat`,
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), var(--surface-color))',
                                    backdropFilter: 'blur(4px)'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    left: '20px',
                                    right: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end'
                                }}>
                                    <h3 style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '800',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                    }}>{booking.show.movie.title}</h3>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div style={{ padding: '20px', flex: 1, position: 'relative' }}>
                                {/* Perforated Line Decoration */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-1px',
                                    left: '10px',
                                    right: '10px',
                                    height: '2px',
                                    borderTop: '2px dashed rgba(255,255,255,0.1)'
                                }} />

                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>THEATER</p>
                                    <p style={{ fontWeight: '600' }}>{booking.show.theater.name}</p>
                                    <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{booking.show.theater.city}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>DATE & TIME</p>
                                        <p style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                            {booking.show.date ? new Date(booking.show.date).toLocaleDateString() : 'Today'}
                                        </p>
                                        <p>{booking.show.time}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>SEATS ({booking.seats.length})</p>
                                        <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{booking.seats.join(', ')}</p>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '12px',
                                    borderRadius: '8px'
                                }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TOTAL PAID</p>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{booking.totalAmount}</p>
                                    </div>
                                    <div style={{
                                        background: '#fff',
                                        padding: '4px',
                                        borderRadius: '4px'
                                    }}>
                                        {/* Simulated QR Code */}
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${booking._id}`}
                                            alt="QR"
                                            style={{ width: '48px', height: '48px', display: 'block' }}
                                        />
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center' }}>
                                    Booking ID: <span style={{ fontFamily: 'monospace' }}>{booking._id.slice(-8).toUpperCase()}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
