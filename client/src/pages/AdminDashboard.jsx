import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, bookings: 0, movies: 0, theaters: 0 });
    const [shows, setShows] = useState([]); // List of all shows for management

    // Tab State
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [showMovieModal, setShowMovieModal] = useState(false);
    const [showShowModal, setShowShowModal] = useState(false);
    const [showTheaterModal, setShowTheaterModal] = useState(false);

    // Form State
    const [movieForm, setMovieForm] = useState({
        title: '', description: '', duration: '', genre: '', language: '', posterUrl: ''
    });
    const [showForm, setShowForm] = useState({
        movieId: '', theaterId: '', screenName: '', date: '', time: '', ticketPrice: '', format: '2D'
    });
    const [theaterForm, setTheaterForm] = useState({
        name: '', city: '', address: '', screens: [{ name: 'Screen 1', rows: 10, cols: 10 }]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [moviesRes, theatersRes, statsRes, bookingsRes, showsRes] = await Promise.all([
                api.get('/movies'),
                api.get('/theaters'),
                api.get('/bookings/stats'),
                api.get('/bookings'),
                api.get('/shows')
            ]);

            setMovies(moviesRes.data.data);
            setTheaters(theatersRes.data.data);
            setStats(statsRes.data.data);
            setAllBookings(bookingsRes.data.data);
            setShows(showsRes.data.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteMovie = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie? This will also remove its shows.')) return;
        try {
            await api.delete(`/movies/${id}`);
            alert('Movie deleted');
            fetchData();
        } catch (err) {
            alert('Failed to delete movie');
        }
    };

    const deleteShow = async (id) => {
        if (!window.confirm('Delete this show?')) return;
        try {
            await api.delete(`/shows/${id}`);
            alert('Show deleted');
            fetchData();
        } catch (err) {
            alert('Failed to delete show');
        }
    };

    const deleteTheater = async (id) => {
        if (!window.confirm('Are you sure you want to delete this theater?')) return;
        try {
            await api.delete(`/theaters/${id}`);
            alert('Theater deleted');
            fetchData();
        } catch (err) {
            alert('Failed to delete theater');
        }
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            const genres = movieForm.genre.split(',').map(g => g.trim());
            await api.post('/movies', { ...movieForm, genre: genres });
            setShowMovieModal(false);
            setMovieForm({ title: '', description: '', duration: '', genre: '', language: '', posterUrl: '' });
            alert('Movie added successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add movie');
        }
    };

    const handleTheaterSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/theaters', theaterForm);
            setShowTheaterModal(false);
            setTheaterForm({ name: '', city: '', address: '', screens: [{ name: 'Screen 1', rows: 10, cols: 10 }] });
            alert('Theater added successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add theater');
        }
    };

    const handleShowSubmit = async (e) => {
        e.preventDefault();
        try {
            const theater = theaters.find(t => t._id === showForm.theaterId);
            const screen = theater.screens.find(s => s.name === showForm.screenName);

            await api.post('/shows', {
                movie: showForm.movieId,
                theater: showForm.theaterId,
                screenName: showForm.screenName,
                date: showForm.date,
                time: showForm.time,
                ticketPrice: showForm.ticketPrice,
                format: showForm.format
            });
            setShowShowModal(false);
            alert('Show scheduled successfully!');
            fetchData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to schedule show');
        }
    };

    // Helper to change specific screen in theater form
    const handleScreenChange = (index, field, value) => {
        const updatedScreens = [...theaterForm.screens];
        updatedScreens[index][field] = value;
        setTheaterForm({ ...theaterForm, screens: updatedScreens });
    };

    const addScreenField = () => {
        setTheaterForm({
            ...theaterForm,
            screens: [...theaterForm.screens, { name: `Screen ${theaterForm.screens.length + 1}`, rows: 10, cols: 10 }]
        });
    };

    const getScreensForSelectedTheater = () => {
        const theater = theaters.find(t => t._id === showForm.theaterId);
        return theater ? theater.screens : [];
    };

    if (loading) return <div className="container" style={{ paddingTop: '40px' }}>Loading Dashboard...</div>;

    return (
        <div className="fade-in">
            <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Admin Dashboard</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
                {['overview', 'movies', 'theaters', 'shows', 'bookings'].map(tab => (
                    <button
                        key={tab}
                        className={`btn ${activeTab === tab ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, textTransform: 'capitalize' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {error && <div className="error-msg">{error}</div>}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', color: '#aaa', marginBottom: '8px' }}>Total Revenue</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4ade80' }}>₹{stats.revenue.toLocaleString()}</p>
                    </div>
                    <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', color: '#aaa', marginBottom: '8px' }}>Total Bookings</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.bookings}</p>
                    </div>
                    <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', color: '#aaa', marginBottom: '8px' }}>Active Movies</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.movies}</p>
                    </div>
                </div>
            )}

            {/* MOVIES TAB */}
            {activeTab === 'movies' && (
                <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Manage Movies</h3>
                        <button className="btn" onClick={() => setShowMovieModal(true)}>+ Add Movie</button>
                    </div>
                    <div className="grid-3">
                        {movies.map(movie => (
                            <div key={movie._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '16px' }}>
                                <img
                                    src={movie.posterUrl}
                                    style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = 'https://via.placeholder.com/60x90?text=No+Img';
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ marginBottom: '4px' }}>{movie.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{movie.genre.join(', ')}</p>
                                    <button onClick={() => deleteMovie(movie._id)} style={{ background: 'transparent', border: '1px solid #e50914', color: '#e50914', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* THEATERS TAB */}
            {activeTab === 'theaters' && (
                <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Manage Theaters</h3>
                        <button className="btn" onClick={() => setShowTheaterModal(true)}>+ Add Theater</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {theaters.map(theater => (
                            <div key={theater._id} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '4px' }}>{theater.name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{theater.address}, {theater.city}</p>
                                    </div>
                                    <button onClick={() => deleteTheater(theater._id)} style={{ background: 'transparent', border: '1px solid #e50914', color: '#e50914', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SHOWS TAB */}
            {activeTab === 'shows' && (
                <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3>Manage Show Schedule</h3>
                        <button className="btn" onClick={() => setShowShowModal(true)}>+ Schedule New Show</button>
                    </div>

                    <div className="table-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #333' }}>
                                    <th style={{ padding: '12px' }}>Date</th>
                                    <th style={{ padding: '12px' }}>Time</th>
                                    <th style={{ padding: '12px' }}>Movie</th>
                                    <th style={{ padding: '12px' }}>Theater</th>
                                    <th style={{ padding: '12px' }}>Price</th>
                                    <th style={{ padding: '12px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shows.map(show => (
                                    <tr key={show._id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '12px' }}>{new Date(show.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px', color: 'var(--primary-color)' }}>{show.time}</td>
                                        <td style={{ padding: '12px' }}>{show.movie?.title}</td>
                                        <td style={{ padding: '12px' }}>{show.theater?.name}</td>
                                        <td style={{ padding: '12px' }}>₹{show.ticketPrice}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={() => deleteShow(show._id)} style={{ color: '#e50914', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {shows.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No shows scheduled.</p>}
                    </div>
                </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: '12px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3>All Bookings</h3>
                    </div>
                    <div className="table-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #333' }}>
                                    <th style={{ padding: '12px' }}>User</th>
                                    <th style={{ padding: '12px' }}>Movie</th>
                                    <th style={{ padding: '12px' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBookings.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '12px' }}>{b.user?.name} <br /><span style={{ fontSize: '0.8rem', color: '#666' }}>{b.user?.email}</span></td>
                                        <td style={{ padding: '12px' }}>{b.show?.movie?.title}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{b.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {allBookings.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No bookings found.</p>}
                    </div>
                </div>
            )}

            {/* ADD MOVIE MODAL */}
            {showMovieModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#1c1c1e', padding: '40px', borderRadius: '24px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}>
                        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Add New Movie</h2>

                        <form onSubmit={handleMovieSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            {/* Left Col: Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Movie Title</label>
                                    <input required placeholder="Enter title" value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} className="input-field" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Description</label>
                                    <textarea required placeholder="Enter plot summary..." value={movieForm.description} onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} className="input-field" style={{ width: '100%', height: '100px', resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Duration (min)</label>
                                        <input required type="number" placeholder="e.g. 120" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })} className="input-field" style={{ width: '100%' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Language</label>
                                        <input required placeholder="e.g. English" value={movieForm.language} onChange={e => setMovieForm({ ...movieForm, language: e.target.value })} className="input-field" style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Genre (comma separated)</label>
                                    <input required placeholder="Action, Drama, Sci-Fi" value={movieForm.genre} onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })} className="input-field" style={{ width: '100%' }} />
                                </div>
                            </div>

                            {/* Right Col: Poster */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Poster Image URL</label>
                                    <input required placeholder="https://example.com/poster.jpg" value={movieForm.posterUrl} onChange={e => setMovieForm({ ...movieForm, posterUrl: e.target.value })} className="input-field" style={{ width: '100%' }} />
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Note: Paste a direct image link (Start with http/https)</p>
                                </div>

                                <div style={{
                                    flex: 1,
                                    background: '#111',
                                    borderRadius: '12px',
                                    border: '2px dashed #333',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    minHeight: '300px'
                                }}>
                                    {movieForm.posterUrl ? (
                                        <img src={movieForm.posterUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <span style={{ color: '#444' }}>Image Preview</span>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '10px' }}>
                                <button type="submit" className="btn" style={{ flex: 1, padding: '14px' }}>Add Movie</button>
                                <button type="button" onClick={() => setShowMovieModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '14px' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD THEATER MODAL */}
            {showTheaterModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#1c1c1e', padding: '40px', borderRadius: '24px', width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Add New Theater</h2>

                        <form onSubmit={handleTheaterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Theater Name</label>
                                <input required placeholder="e.g. PVR Nexus" value={theaterForm.name} onChange={e => setTheaterForm({ ...theaterForm, name: e.target.value })} className="input-field" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>City</label>
                                <input required placeholder="e.g. Mumbai" value={theaterForm.city} onChange={e => setTheaterForm({ ...theaterForm, city: e.target.value })} className="input-field" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Address</label>
                                <input required placeholder="Full address" value={theaterForm.address} onChange={e => setTheaterForm({ ...theaterForm, address: e.target.value })} className="input-field" style={{ width: '100%' }} />
                            </div>

                            {/* Screens Section */}
                            <div>
                                <h4 style={{ marginBottom: '12px', color: '#eee' }}>Screens & Capacity</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {theaterForm.screens.map((screen, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input required placeholder="Screen Name" value={screen.name} onChange={e => handleScreenChange(idx, 'name', e.target.value)} className="input-field" style={{ flex: 2 }} />
                                            <input required type="number" placeholder="Rows" value={screen.rows} onChange={e => handleScreenChange(idx, 'rows', e.target.value)} className="input-field" style={{ flex: 1 }} />
                                            <input required type="number" placeholder="Cols" value={screen.cols} onChange={e => handleScreenChange(idx, 'cols', e.target.value)} className="input-field" style={{ flex: 1 }} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addScreenField} style={{ alignSelf: 'start', background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: '4px 0' }}>+ Add Another Screen</button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                                <button type="submit" className="btn" style={{ flex: 1, padding: '14px' }}>Save Theater</button>
                                <button type="button" onClick={() => setShowTheaterModal(false)} className="btn btn-secondary" style={{ flex: 1, padding: '14px' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Show Modal */}
            {showShowModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#1a1a1a', padding: '30px', borderRadius: '16px', width: '500px', maxWidth: '90%' }}>
                        <h2>Schedule Show</h2>
                        <form onSubmit={handleShowSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <select required value={showForm.movieId} onChange={e => setShowForm({ ...showForm, movieId: e.target.value })} className="input-field">
                                <option value="">Select Movie</option>
                                {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                            </select>

                            <select required value={showForm.theaterId} onChange={e => setShowForm({ ...showForm, theaterId: e.target.value })} className="input-field">
                                <option value="">Select Theater</option>
                                {theaters.map(t => <option key={t._id} value={t._id}>{t.name} ({t.city})</option>)}
                            </select>

                            <select required value={showForm.screenName} onChange={e => setShowForm({ ...showForm, screenName: e.target.value })} className="input-field" disabled={!showForm.theaterId}>
                                <option value="">Select Screen</option>
                                {getScreensForSelectedTheater().map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                            </select>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input required type="date" value={showForm.date} onChange={e => setShowForm({ ...showForm, date: e.target.value })} className="input-field" />
                                <input required type="time" value={showForm.time} onChange={e => setShowForm({ ...showForm, time: e.target.value })} className="input-field" />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input required type="number" placeholder="Price (₹)" value={showForm.ticketPrice} onChange={e => setShowForm({ ...showForm, ticketPrice: e.target.value })} className="input-field" />
                                <select value={showForm.format} onChange={e => setShowForm({ ...showForm, format: e.target.value })} className="input-field">
                                    <option value="2D">2D</option>
                                    <option value="3D">3D</option>
                                    <option value="IMAX">IMAX</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>Schedule</button>
                                <button type="button" onClick={() => setShowShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
