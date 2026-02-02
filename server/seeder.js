const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Movie = require('./src/models/Movie');
const Theater = require('./src/models/Theater');
const Show = require('./src/models/Show');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import into DB
const importData = async () => {
    try {
        // Clear DB
        await User.deleteMany();
        await Movie.deleteMany();
        await Theater.deleteMany();
        await Show.deleteMany();

        console.log('Data Destroyed...');

        // Create Users
        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@tikat.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'user@tikat.com',
                password: 'password123',
                role: 'user'
            }
        ]);

        const adminUser = createdUsers[0]._id;

        console.log('Users Imported...');

        // Create Movies
        const movies = await Movie.create([
            {
                title: 'Interstellar',
                description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                duration: 169,
                genre: ['Sci-Fi', 'Adventure', 'Drama'],
                language: 'English',
                posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E'
            },
            {
                title: 'The Dark Knight',
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                duration: 152,
                genre: ['Action', 'Crime', 'Drama'],
                language: 'English',
                posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
            },
            {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                duration: 148,
                genre: ['Action', 'Sci-Fi', 'Adventure'],
                language: 'English',
                posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
            },
            {
                title: 'Avengers: Endgame',
                description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe.',
                duration: 181,
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                language: 'English',
                posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
                trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c'
            },
            // Hindi Movies
            {
                title: 'RRR',
                description: 'A fictional story of two legendary revolutionaries and their journey away from home before they started fighting for their country.',
                duration: 187,
                genre: ['Action', 'Drama', 'Adventure'],
                language: 'Hindi',
                posterUrl: '/posters/rrr.png',
                trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy386M'
            },
            {
                title: 'Pathaan',
                description: 'An exiled RAW agent partners with a Pakistani ex-ISI agent to stop a former RAW agent from unleashing a chemical weapon in India.',
                duration: 146,
                genre: ['Action', 'Thriller', 'Adventure'],
                language: 'Hindi',
                posterUrl: '/posters/pathaan.png',
                trailerUrl: 'https://www.youtube.com/watch?v=vqu4z34wENw'
            },
            {
                title: 'Jawan',
                description: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
                duration: 169,
                genre: ['Action', 'Thriller', 'Drama'],
                language: 'Hindi',
                posterUrl: '/posters/jawan.png',
                trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws'
            },
            // Kannada Movies
            {
                title: 'KGF Chapter 2',
                description: 'In the blood-soaked Kolar Gold Fields, Rocky\'s name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.',
                duration: 168,
                genre: ['Action', 'Crime', 'Drama'],
                language: 'Kannada',
                posterUrl: '/posters/kgf.png',
                trailerUrl: 'https://www.youtube.com/watch?v=JKa05nyUmuQ'
            },
            {
                title: 'Kantara',
                description: 'When greed paves the way for betrayal, scheming and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice.',
                duration: 148,
                genre: ['Action', 'Drama', 'Thriller'],
                language: 'Kannada',
                posterUrl: '/posters/kantara.png',
                trailerUrl: 'https://www.youtube.com/watch?v=8mZBOKLp4U0'
            },
            // Marathi Movies
            {
                title: 'Sairat',
                description: 'A love story between a lower-caste boy and an upper-caste girl in rural Maharashtra.',
                duration: 174,
                genre: ['Drama', 'Romance'],
                language: 'Marathi',
                posterUrl: '/posters/sairat.png',
                trailerUrl: 'https://www.youtube.com/watch?v=wXW2i7m5QJM'
            },
            {
                title: 'Natsamrat',
                description: 'The journey of a retired theatre actor and his emotional baggage of personal grief, abandonment and loneliness.',
                duration: 165,
                genre: ['Drama', 'Family'],
                language: 'Marathi',
                posterUrl: '/posters/natsamrat.svg',
                trailerUrl: 'https://www.youtube.com/watch?v=8oDq0G3Y4S4' // Using a placeholder/related link as Natsamrat might vary
            }
        ]);

        console.log('Movies Imported...');

        // Create Theaters (Bangalore)
        const theaters = await Theater.create([
            {
                name: 'PVR Koramangala',
                city: 'Bangalore',
                address: 'The Forum Mall, Koramangala',
                screens: [
                    { name: 'Gold Class', rows: 5, cols: 8 },
                    { name: 'Screen 1', rows: 10, cols: 15 }
                ],
                location: {
                    type: 'Point',
                    coordinates: [77.6112, 12.9345],
                    formattedAddress: 'The Forum Mall, Koramangala, Bangalore'
                }
            },
            {
                name: 'INOX Mantri Square',
                city: 'Bangalore',
                address: 'Mantri Square Mall, Malleshwaram',
                screens: [
                    { name: 'Screen 1', rows: 12, cols: 18 },
                    { name: 'INSIGNIA', rows: 6, cols: 10 }
                ],
                location: {
                    type: 'Point',
                    coordinates: [77.5709, 12.9915],
                    formattedAddress: 'Mantri Square Mall, Malleshwaram, Bangalore'
                }
            },
            {
                name: 'Cinepolis Orion',
                city: 'Bangalore',
                address: 'Orion Mall, Rajajinagar',
                screens: [
                    { name: 'Screen 1 (IMAX)', rows: 15, cols: 25 },
                    { name: 'Screen 2', rows: 10, cols: 15 }
                ],
                location: {
                    type: 'Point',
                    coordinates: [77.5549, 13.0110],
                    formattedAddress: 'Orion Mall, Rajajinagar, Bangalore'
                }
            }
        ]);

        console.log('Theaters Imported...');

        // Create Shows (Next 7 Days)
        const shows = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const showDate = new Date(today);
            showDate.setDate(today.getDate() + i);

            // PVR Koramangala Shows
            shows.push({
                movie: movies[0]._id, // Interstellar
                theater: theaters[0]._id,
                screen: theaters[0].screens[1], // Screen 1
                date: showDate,
                time: '18:00',
                ticketPrice: 400,
                format: '2D'
            });
            shows.push({
                movie: movies[1]._id, // Dark Knight
                theater: theaters[0]._id,
                screen: theaters[0].screens[0], // Gold Class
                date: showDate,
                time: '20:30',
                ticketPrice: 900,
                format: '2D'
            });

            // INOX Mantri
            shows.push({
                movie: movies[3]._id, // Endgame
                theater: theaters[1]._id,
                screen: theaters[1].screens[0],
                date: showDate,
                time: '19:00',
                ticketPrice: 350,
                format: '3D'
            });

            // Cinepolis Orion
            shows.push({
                movie: movies[0]._id, // Interstellar
                theater: theaters[2]._id,
                screen: theaters[2].screens[0], // IMAX
                date: showDate,
                time: '17:00',
                ticketPrice: 600,
                format: 'IMAX'
            });

            // Add variety based on day parity
            if (i % 2 === 0) {
                shows.push({
                    movie: movies[4]._id, // RRR
                    theater: theaters[0]._id,
                    screen: theaters[0].screens[1],
                    date: showDate,
                    time: '14:00',
                    ticketPrice: 450,
                    format: '2D'
                });
            } else {
                shows.push({
                    movie: movies[5]._id, // Pathaan
                    theater: theaters[0]._id,
                    screen: theaters[0].screens[1],
                    date: showDate,
                    time: '21:00',
                    ticketPrice: 400,
                    format: '2D'
                });
            }
        }

        await Show.create(shows);

        console.log('Shows Imported...');

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Movie.deleteMany();
        await Theater.deleteMany();
        await Show.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
