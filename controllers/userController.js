import { db } from '../config/db.js';
import { createUser } from '../models/userModel.js'; // Import the model function

// Controller to handle user account creation
const createAccount = async (req, res) => {
    const { name, number, business_name, total_seats } = req.body;

    // Validate input fields
    if (!name || !number || !business_name || total_seats === undefined) {
        return res.status(400).json({ error: 'All fields (name, number, business_name, total_seats) are required' });
    }

    const account_creation_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Step 1: Ensure the users table exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                number VARCHAR(20) NOT NULL UNIQUE,
                business_name VARCHAR(255) NOT NULL,
                account_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_seats INT NOT NULL
            );
        `;

        await new Promise((resolve, reject) => {
            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                    return reject(err);
                }
                console.log('Users table created or already exists.');
                resolve();
            });
        });

        // Step 2: Check if the phone number already exists in the database
        const checkNumberQuery = 'SELECT COUNT(*) AS count FROM users WHERE number = ?';
        const existingUser = await new Promise((resolve, reject) => {
            db.query(checkNumberQuery, [number], (err, results) => {
                if (err) {
                    console.error('Error checking if number exists:', err);
                    return reject(err);
                }
                resolve(results[0]?.count || 0);
            });
        });

        // If the phone number already exists, return an error
        if (existingUser > 0) {
            return res.status(400).json({ error: 'A user with this number already exists' });
        }

        // Step 3: Call the model function to create a new user
        const result = await createUser(name, number, business_name, account_creation_date, total_seats);

        // Step 4: Return success response with the new user's ID
        res.status(201).json({
            message: 'Account created successfully',
            userId: result.insertId, // Assuming insertId is returned from the database
        });
    } catch (err) {
        // Handle any errors that occur during the process
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { createAccount };
