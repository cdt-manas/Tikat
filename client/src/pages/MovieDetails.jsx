import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState(''); // Could hold user detected location

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const movieRes = await api.get(`/movies/${id}`);
                setMovie(movieRes.data.data);

                // Fetch shows for this movie
                const showRes = await api.get(`/shows?movie=${id}`);
                setShows(showRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMethods();
    }, [id]);

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;
    if (!movie) return <div className="container" style={{ paddingTop: '40px' }}>Movie not found</div>;

    // Group shows by theater
    const showsByTheater = shows.reduce((acc, show) => {
        const theaterId = show.theater._id;
        if (!acc[theaterId]) {
            acc[theaterId] = {
                name: show.theater.name,
                city: show.theater.city,
                shows: []
            };
        }
        acc[theaterId].shows.push(show);
        return acc;
    }, {});

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '40px',
                boxShadow: '0 20px 30px rgba(0,0,0,0.5)'
            }}>
                <img
                    src={movie.posterUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.4,
                        filter: 'blur(20px)',
                        transform: 'scale(1.1)'
                    }}
                    onError={(e) => e.target.style.display = 'none'} // Hide background on error
                />
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '40px',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.9), transparent)'
                }}>
                    <img
                        src={movie.posterUrl}
                        style={{ height: '320px', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster';
                        }}
                    />
                    <div style={{ marginLeft: '40px' }}>
                        <h1 style={{ fontSize: '3.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{movie.title}</h1>
                        <div style={{ display: 'flex', gap: '10px', margin: '16px 0' }}>
                            {movie.genre.map(g => <span key={g} style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>{g}</span>)}
                        </div>
                        <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: '#ccc' }}>{movie.description}</p>
                        <p style={{ marginTop: '20px', color: '#aaa' }}>Duration: {Math.floor(movie.duration / 60)}h {movie.duration % 60}m • {movie.language}</p>
                    </div>
                </div>
            </div>

            {/* Shows Section */}
            <h2 style={{ marginBottom: '20px' }}>Available Shows</h2>
            {Object.keys(showsByTheater).length === 0 ? (
                <p style={{ color: '#aaa' }}>No shows currently scheduled for this movie.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.values(showsByTheater).map((theater, idx) => (
                        <div key={idx} style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '4px' }}>{theater.name}</h3>
                            <p style={{ color: '#888', marginBottom: '16px', fontSize: '0.9rem' }}>{theater.city}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                {theater.shows.map(show => (
                                    <Link
                                        to={`/book/${show._id}`}
                                        key={show._id}
                                        className="btn btn-secondary"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: '12px 20px',
                                            border: '1px solid var(--border-color)',
                                            minWidth: '100px'
                                        }}
                                    >
                                        <span style={{ color: '#46d369', fontWeight: 'bold' }}>{show.time}</span>
                                        <span style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>{show.format || '2D'}</span>
                                        <span style={{ fontSize: '0.75rem', marginTop: '2px', opacity: 0.5 }}>₹{show.ticketPrice}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
