import { useRef } from 'react';
import { Link } from 'react-router-dom';

const MovieCarousel = ({ movies }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="carousel-container reveal" style={{ position: 'relative', marginBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Featured Movies</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => scroll('left')}
                        className="btn btn-secondary"
                        style={{ padding: '10px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        ←
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="btn btn-secondary"
                        style={{ padding: '10px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        →
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="movie-carousel"
                style={{
                    display: 'flex',
                    gap: '24px',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    paddingBottom: '20px',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                    paddingLeft: '4px', // Avoid cutting off shadows
                    paddingRight: '4px'
                }}
            >
                {/* Hide scrollbar for Chrome/Safari */}
                <style>{`
                    .movie-carousel::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {movies.map((movie) => (
                    <Link
                        to={`/movies/${movie._id}`}
                        key={movie._id}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            flex: '0 0 auto',
                            width: '280px',
                            scrollSnapAlign: 'start'
                        }}
                    >
                        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ width: '100%', aspectRatio: '2/3', position: 'relative' }}>
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                    className="carousel-poster"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;background:#222;color:#444;">🎬</div>';
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                    padding: '20px',
                                    paddingTop: '60px'
                                }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '4px' }}>{movie.title}</h3>
                                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{movie.genre[0]} • {movie.language}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MovieCarousel;
