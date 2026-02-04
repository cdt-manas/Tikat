import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import DatePicker from '../components/DatePicker';
import MovieCarousel from '../components/MovieCarousel';

import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [selectedDate, setSelectedDate] = useState('All');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await api.get('/movies');
                setAllMovies(data.data);
                setMovies(data.data);
            } catch (err) {
                console.error(err);
                setError('Unable to load movies. Service might be down.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Filter movies when language or date changes
    useEffect(() => {
        console.log(`Filtering - Language: ${selectedLanguage}, Date: ${selectedDate}`);
        const fetchByDate = async () => {
            // If All Dates, just rely on allMovies
            if (selectedDate === 'All') {
                let filtered = [...allMovies];
                if (selectedLanguage !== 'All') {
                    filtered = filtered.filter(movie => movie.language?.trim() === selectedLanguage);
                }
                console.log(`Filtered count: ${filtered.length}`);
                setMovies(filtered);
                return;
            }

            // If specific date, fetch shows for that date to find which movies are playing
            try {
                // Convert today/tomorrow strings to dates or keep as is if backend handles it
                // We'll pass the date string directly to backend
                // Note: The DatePicker component likely returns a Date object or ISO string.
                // Let's assume DatePicker returns an ISO string or Date object.
                const { data } = await api.get(`/shows?date=${selectedDate}`);
                const shows = data.data;

                // Extract unique movie IDs from shows
                const movieIds = [...new Set(shows.map(s => s.movie._id))];

                // Filter allMovies by these IDs
                let filtered = allMovies.filter(m => movieIds.includes(m._id));

                if (selectedLanguage !== 'All') {
                    filtered = filtered.filter(movie => movie.language?.trim() === selectedLanguage);
                }
                console.log(`Filtered count (with date): ${filtered.length}`);
                setMovies(filtered);

            } catch (err) {
                console.error("Error filtering by date", err);
            }
        };

        fetchByDate();
    }, [selectedLanguage, selectedDate, allMovies]);

    /* Scroll Animation Logic */
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(r => observer.observe(r));

        return () => reveals.forEach(r => observer.unobserve(r));
    }, [movies]);

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => {
                alert("Location Detected! Showing movies near Bangalore (Simulated).");
            }, () => {
                alert("Location access denied.");
            });
        }
    };

    // Get unique languages (Robust)
    const languages = ['All', ...new Set(allMovies.map(m => m.language).filter(Boolean).map(l => l.trim()))];

    if (loading) return <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div className="container" style={{ paddingTop: '80px', color: '#e50914' }}>{error}</div>;

    return (
        <div className="container fade-in" style={{ paddingTop: '20px' }}>

            {/* Hero Carousel Section */}
            {movies.length > 0 && <HeroCarousel movies={movies.slice(0, 5)} />}

            {/* Section Header */}
            <div className="reveal" style={{ marginBottom: '24px', display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '8px',
                        background: 'linear-gradient(45deg, #fff, #bbb)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Now Showing</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Book tickets for the latest movies near you
                    </p>
                </div>
            </div>

            {/* Glassmorphic Filter Bar */}
            <div className="reveal" style={{
                position: 'relative',
                marginBottom: '50px',
                padding: '24px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', gap: '16px', flex: '0 0 auto' }}>
                    <button
                        onClick={handleLocation}
                        style={{
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '0 24px',
                            borderRadius: '16px',
                            background: '#e50914',
                            border: 'none',
                            color: '#fff',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span>📍</span> Region
                    </button>

                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            style={{
                                height: '50px',
                                appearance: 'none',
                                padding: '0 40px 0 20px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                fontSize: '1rem',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '140px'
                            }}
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang} style={{ background: '#222' }}>{lang}</option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.8rem', color: '#aaa' }}>▼</div>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                    <DatePicker
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                </div>
            </div>

            {/* Featured Carousel (Secondary) */}
            {/* {movies.length > 0 && <MovieCarousel movies={movies} />} */}
            {/* Keeping code but commenting out as HeroCarousel takes prominence, or we can keep it for "Recommended" */}

            <h2 className="reveal" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>All Movies</h2>

            {/* Movies Grid */}
            <div className="grid-4">
                {movies.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                        <h3>No movies found matching your filters</h3>
                        <p style={{ marginTop: '10px' }}>Try changing your filter preferences</p>
                    </div>
                ) : (
                    movies.map((movie) => (
                        <Link to={`/movies/${movie._id}`} key={movie._id} className="movie-card reveal" style={{ background: 'var(--surface-color)', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ width: '100%', aspectRatio: '2/3', background: '#333', position: 'relative' }}>
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;">🎬</div>';
                                    }}
                                />
                            </div>
                            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{movie.genre.join(', ')}</p>
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{movie.language}</span>
                                    <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold' }}>Book Now →</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
