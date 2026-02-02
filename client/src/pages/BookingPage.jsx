import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import AuthContext from '../context/AuthContext';

const BookingPage = () => {
    const { id } = useParams(); // Show ID
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [show, setShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingProcessing, setBookingProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const { data } = await api.get(`/shows/${id}`);
                setShow(data.data);
            } catch (err) {
                setError('Failed to load show details');
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
    }, [id]);

    const handleSeatClick = (seatId) => {
        if (show.bookedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatId));
        } else {
            if (selectedSeats.length >= 6) {
                alert('You can only select up to 6 seats');
                return;
            }
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        setBookingProcessing(true);
        try {
            // Updated Flow: Create Stripe Checkout Session
            const { data } = await api.post('/bookings/create-checkout-session', {
                showId: id,
                seats: selectedSeats
            });

            if (data.success && data.url) {
                // Direct redirect to Stripe URL (replaces deprecated redirectToCheckout)
                window.location.href = data.url;
            } else {
                alert('Payment initiation failed: No payment URL returned.');
                console.error('Payment Init Data:', data);
            }
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || err.message || 'Payment initiation failed';
            alert(`Error: ${errMsg}`);
        } finally {
            setBookingProcessing(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading layout...</div>;
    if (error) return <div className="container" style={{ paddingTop: '40px' }}>{error}</div>;

    // Generate Visual Grid based on rows/cols
    const { rows, cols } = show.screen;
    const seatGrid = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (let r = 0; r < rows; r++) {
        const rowSeats = [];
        for (let c = 1; c <= cols; c++) {
            const seatId = `${rowLabels[r]}${c}`;
            const isBooked = show.bookedSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);

            rowSeats.push(
                <div
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    style={{
                        width: '32px',
                        height: '28px',
                        borderRadius: '8px 8px 4px 4px', // Rounded top for chair back
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        background: isBooked ? '#3a3a3a' : isSelected ? '#e50914' : '#fff',
                        color: isBooked ? '#555' : isSelected ? '#fff' : '#000',
                        boxShadow: isBooked ? 'none' : isSelected ? '0 0 10px rgba(229, 9, 20, 0.5)' : '0 2px 0px #ccc',
                        position: 'relative',
                        transform: `scale(${isSelected ? 1.1 : 1})`,
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    title={`Seat ${seatId}`}
                >
                    {c}
                </div>
            );
        }
        const offset = Math.abs(r - rows / 2); // Distance from center row
        seatGrid.push(<div key={r} style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '12px',
            justifyContent: 'center',
            transform: `scale(${1 - (offset * 0.01)})` // Slight perspective scale
        }}>
            <span style={{ width: '20px', display: 'flex', alignItems: 'center', color: '#555', fontSize: '0.8rem' }}>{rowLabels[r]}</span>
            {rowSeats}
        </div>);
    }

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Info Section */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <img src={show.movie.posterUrl} style={{ width: '100px', borderRadius: '8px', marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '2rem' }}>{show.movie.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{show.theater.name}, {show.theater.city}</p>
                    <p style={{ marginTop: '8px' }}><span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px' }}>{show.screen.name}</span> <span style={{ marginLeft: '8px', color: 'var(--primary-color)' }}>{show.time}</span></p>
                    <hr style={{ borderColor: 'var(--border-color)', margin: '24px 0' }} />
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div>
                            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Tickets</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedSeats.length}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Total Price</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹ {selectedSeats.length * show.ticketPrice}</p>
                        </div>
                    </div>
                    <button
                        className="btn btn-block"
                        style={{ marginTop: '24px' }}
                        onClick={handleBooking}
                        disabled={bookingProcessing}
                    >
                        {bookingProcessing ? 'Processing...' : 'Confirm Booking'}
                    </button>
                    {selectedSeats.length > 0 && <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa' }}>Selected: {selectedSeats.join(', ')}</p>}
                </div>

                {/* Seat Layout Section */}
                <div style={{ flex: 2, background: 'var(--surface-color)', padding: '32px', borderRadius: '16px', minWidth: '350px' }}>
                    <div style={{ width: '100%', height: '8px', background: 'linear-gradient(to right, transparent, var(--primary-color), transparent)', borderRadius: '50%', marginBottom: '40px', opacity: 0.5 }}></div>
                    <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Screen This Way</p>

                    <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
                        {seatGrid}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Available</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#e50914', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Selected</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', background: '#555', borderRadius: '4px' }}></div>
                            <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Booked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
