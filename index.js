// server.js (Entry point file)
import express from 'express';        // Import express using ES module syntax
import { testConnection } from './config/db.js'; 
import userRoutes from './routes/userRoutes.js';
import updateSeatRoutes from './routes/update_seatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import update_total_seats from './routes/update_totalseatRoutes.js'
import fetch_all_seats_data from './routes/fetch_seats_Routes.js'
import fetch_userdetails from './routes/fetch_user_details_Routes.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());


// Test database connection
testConnection();

// Use the routes defined in userRoutes
app.use('/api/users', userRoutes);

// Use the seat routes
// Use the update seat routes
app.use('/api/seats', updateSeatRoutes);

app.use('/api/auth', authRoutes); // Use the auth routes


app.use('/api/total_seats', update_total_seats);

app.use('/api/seatdata',fetch_all_seats_data);

app.use('/api/userData', fetch_userdetails);



// Define a route for "Hello, World!"
app.get('/', (req, res) => {
    res.send('Hello! The server is up and running.');
});

// Catch-all for 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
