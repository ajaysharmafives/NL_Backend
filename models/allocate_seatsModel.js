import { db } from '../config/db.js'; // Import the database connection pool

const allocateSeatsModel = {
  /**
   * Creates the seats_data table if it doesn't exist.
   * Adds any missing columns (like isAllocated) if they are not present.
   */
  async ensureTableExists() {
    // Define the query to create the table with the new field isAllocated
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS seats_data (
        seatId INT NOT NULL PRIMARY KEY,
        userId INT NOT NULL,
        seatName VARCHAR(255) NOT NULL,
        studentName VARCHAR(255) NOT NULL,
        studentNumber VARCHAR(15) NOT NULL,
        subscriptionStartDate DATE NOT NULL,
        subscriptionEndDate DATE NOT NULL,
        isAllocated BOOLEAN DEFAULT FALSE
      );
    `;

    // Define the query to add the column if it doesn't exist
    const addColumnQuery = `
      ALTER TABLE seats_data
      ADD COLUMN IF NOT EXISTS isAllocated BOOLEAN DEFAULT FALSE;
    `;

    try {
      // Create table if it doesn't exist
      await new Promise((resolve, reject) => {
        db.query(createTableQuery, (err, result) => {
          if (err) {
            reject(new Error('Error creating table: ' + err.message));
          }
          resolve(result);
        });
      });

      // Add the isAllocated column if it doesn't exist
      await new Promise((resolve, reject) => {
        db.query(addColumnQuery, (err, result) => {
          if (err) {
            reject(new Error('Error adding isAllocated column: ' + err.message));
          }
          resolve(result);
        });
      });
    } catch (error) {
      console.error('Error ensuring table exists:', error);
      throw error;
    }
  },

  /**
   * Inserts a new seat allocation record into the seats_data table.
   * @param {Object} seatData - The seat allocation data.
   * @returns {Promise<Object>} - The result of the database insertion.
   */
  create(seatData) {
    const query = `
      INSERT INTO seats_data (seatId, userId, seatName, studentName, studentNumber, subscriptionStartDate, subscriptionEndDate, isAllocated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      seatData.seatId,
      seatData.userId,
      seatData.seatName,
      seatData.studentName,
      seatData.studentNumber,
      seatData.subscriptionStartDate,
      seatData.subscriptionEndDate,
      seatData.isAllocated || false, // Default to false if not provided
    ];

    // Return a Promise for handling the query asynchronously
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          reject(new Error('Error inserting data: ' + err.message));
        } else {
          resolve(result); // Return the query result
        }
      });
    });
  },
};

export default allocateSeatsModel;
