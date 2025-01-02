import { db } from '../config/db.js'; // Import the database connection pool

const allocateSeatsModel = {
  /**
   * Creates the seats_data table if it doesn't exist.
   * Adds any missing columns (like isAllocated) if they are not present.
   */
  async ensureTableExists() {
    // Define the query to create the table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS seats_data (
        seatId INT NOT NULL PRIMARY KEY,
        userId INT NOT NULL,
        seatName VARCHAR(255) NOT NULL,
        studentName VARCHAR(255) NOT NULL,
        studentNumber VARCHAR(15) NOT NULL,
        subscriptionStartDate DATE NOT NULL,
        subscriptionEndDate DATE NOT NULL,
        isAllocated BOOLEAN DEFAULT FALSE,
        subscriptionStatus BOOLEAN DEFAULT FALSE
      );
    `;

    // Query to check if the columns exist
    const checkColumnQuery = `
      SELECT COUNT(*) AS columnExists
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'seats_data'
      AND (COLUMN_NAME = 'isAllocated' OR COLUMN_NAME = 'subscriptionStatus');
    `;

    // Query to add the columns if they don't exist
    const addColumnQuery = `
      ALTER TABLE seats_data
      ADD COLUMN isAllocated BOOLEAN DEFAULT FALSE,
      ADD COLUMN subscriptionStatus BOOLEAN DEFAULT FALSE;
    `;

    try {
      // Create the table if it doesn't exist
      await new Promise((resolve, reject) => {
        db.query(createTableQuery, (err, result) => {
          if (err) {
            reject(new Error('Error creating table: ' + err.message));
          } else {
            resolve(result);
          }
        });
      });

      // Check if the isAllocated or subscriptionStatus columns exist
      const columnCheck = await new Promise((resolve, reject) => {
        db.query(checkColumnQuery, (err, results) => {
          if (err) {
            reject(new Error('Error checking column existence: ' + err.message));
          } else {
            resolve(results[0].columnExists);
          }
        });
      });

      // Add the columns if they don't exist
      if (columnCheck === 0) {
        await new Promise((resolve, reject) => {
          db.query(addColumnQuery, (err, result) => {
            if (err) {
              reject(new Error('Error adding columns: ' + err.message));
            } else {
              resolve(result);
            }
          });
        });
      }
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
      INSERT INTO seats_data (seatId, userId, seatName, studentName, studentNumber, subscriptionStartDate, subscriptionEndDate, isAllocated, subscriptionStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      seatData.subscriptionStatus || false, // Fix typo here
    ];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          reject(new Error('Error inserting data: ' + err.message));
        } else {
          resolve(result);
        }
      });
    });
  },
};

export default allocateSeatsModel;
