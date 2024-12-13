import { db } from '../config/db.js';
import { createUser } from '../models/userModel.js'; // Import the model function

// Controller to handle user account creation
const createAccount = async (req, res) => {
    const { name, number, business_name, total_seats } = req.body;

    // Validate input fields
    if (!name || !number || !business_name || total_seats === undefined) {
        return res.status(400).json({ error: 'All fields (name, number, business_name, total_seats) are required' });
    }
    //const account_creation_date = new Date().toISOString(); // Current timestamp
    const account_creation_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Step 1: Ensure the users table exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                number VARCHAR(20) NOT NULL,
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

        // Step 2: Call the model function to create a new user
        const result = await createUser(name, number, business_name, account_creation_date, total_seats);

             // Step 3: Return success response with the new user's ID
             res.status(201).json({
                message: 'Account created successfully',
                userId: result.insertId, // Assuming insertId is returned from the database
            });

     } catch (err) {
        // Handle any errors that occur during the process
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

    
};


// Controller function to update total_seats
const updateTotalSeats = async (req, res) => {
    const { userId, total_seats } = req.body;

    // Validate input fields
    if (!userId || total_seats === undefined) {
        return res.status(400).json({ error: 'Both userId and total_seats are required' });
    }

    try {
        const query = `UPDATE users SET total_seats = ? WHERE id = ?`;

        await new Promise((resolve, reject) => {
            db.query(query, [total_seats, userId], (err, results) => {
                if (err) {
                    console.error('Error updating total_seats:', err.message);
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('No user found with the provided ID'));
                }
                console.log('Total seats updated successfully.');
                resolve();
            });
        });

        res.status(200).json({ 
            message: 'Total seats updated successfully',
            data: {
                userId
            }
        });

    } catch (err) {
        // Handle any errors that occur during the process
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};






export { createAccount, updateTotalSeats };
