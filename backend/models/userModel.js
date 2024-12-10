// models/userModel.js
import { db } from '../config/db.js';  // Import the DB pool

// Function to create a user in the database
const createUser = async (name, number, businessName, accountCreationDate) => {
    const query = `
        INSERT INTO users (name, number, business_name, account_creation_date)
        VALUES (?, ?, ?, ?)
    `;
    
    try {
        const [results] = await db.promise().query(query, [name, number, businessName, accountCreationDate]);
        return results;  // Return the results of the insert operation
    } catch (err) {
        throw new Error('Database error while creating user: ' + err.message);
    }
};

export { createUser };
