
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroCarousel = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 5000); // 5 seconds per slide for better readability

        return () => clearInterval(interval);
    }, [movies.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    if (!movies || movies.length === 0) return null;

    const currentMovie = movies[currentIndex];

    return (
        <div className="hero-carousel reveal" style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '60px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
            {/* Background Image (Blurred) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${currentMovie.posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px) brightness(0.4)',
                transform: 'scale(1.1)',
                transition: 'background-image 0.5s ease-in-out'
            }} />

            {/* Content Container */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                gap: '60px'
            }}>
                {/* Poster Image (Card) */}
                <div style={{
                    flex: '0 0 300px',
                    height: '450px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    transform: 'perspective(1000px) rotateY(5deg)',
                    transition: 'transform 0.3s ease',
                    display: 'none', // Hide on mobile
                    '@media (min-width: 768px)': { display: 'block' } // Only show on desktop (inline styles usually don't support media queries, handled via className logic below if using standard css or just conditionally rendering)
                }} className="hero-poster">
                    <img
                        src={currentMovie.posterUrl}
                        alt={currentMovie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#333'; }}
                    />
                </div>

                {/* Text Content */}
                <div style={{
                    flex: 1,
                    color: '#fff',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'var(--primary-color)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        width: 'fit-content'
                    }}>
                        #{currentIndex + 1} Trending
                    </span>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '16px',
                        lineHeight: 1.1
                    }}>
                        {currentMovie.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', fontSize: '1rem', color: '#ccc' }}>
                        <span>{currentMovie.language}</span>
                        <span>•</span>
                        <span>{currentMovie.genre.join(', ')}</span>
                        <span>•</span>
                        <span>{Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m</span>
                    </div>
                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        color: '#ddd',
                        marginBottom: '32px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {currentMovie.description || "Experience this cinematic masterpiece on the big screen. Book your tickets now for an unforgettable experience."}
                    </p>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link
                            to={`/movies/${currentMovie._id}`}
                            className="btn"
                            style={{
                                padding: '14px 32px',
                                fontSize: '1.1rem',
                                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
                            }}
                        >
                            Get Tickets 🎟️
                        </Link>
                        <a
                            href={currentMovie.trailerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff',
                                padding: '14px 24px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            ▶ Trailer
                        </a>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button onClick={prevSlide} style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.3)',
                border: 'none',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5rem',
                backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>❮</button>

            <button onClick={nextSlide} style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.3)',
                border: 'none',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5rem',
                backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>❯</button>

            {/* Dots */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 10
            }}>
                {movies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? '30px' : '10px',
                            height: '10px',
                            borderRadius: '5px',
                            background: idx === currentIndex ? 'var(--primary-color)' : 'rgba(255,255,255,0.3)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'width 0.3s'
                        }}
                    />
                ))}
            </div>

            {/* Mobile CSS Patch */}
            <style>{`
                @media (max-width: 768px) {
                    .hero-poster { display: none !important; }
                    .hero-carousel { height: 400px !important; }
                    h1 { fontSize: 2.5rem !important; }
                }
            `}</style>
        </div>
    );
};

export default HeroCarousel;
