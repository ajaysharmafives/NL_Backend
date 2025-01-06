import mysql from 'mysql2'; // Use callback-based client
import dotenv from 'dotenv';
dotenv.config();


    // console.log('Environment Variables:', {
    //     HOST: process.env.HOST,
    //     USERNAME: process.env.MYUSERNAME,
    //     PASSWORD: process.env.PASSWORD,
    //     DATABASE: process.env.DATABASE,
    // });


// const db = mysql.createPool({
//     host: process.env.HOST,  // Should match .env key: HOST
//     user: process.env.MYUSERNAME, // Should match .env key: USERNAME
//     password: process.env.PASSWORD, // Should match .env key: PASSWORD
//     database: process.env.DATABASE, // Should match .env key: DATABASE
// });


const db = mysql.createPool({
    host: 'mysql-3be60ee0-ajaysharmawork80-nlpro.f.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_Z6tbzUKogJuREW-791f',  // Use your MySQL password here if necessary
    database: 'defaultdb',
    port: '17489'  // Your database name
});


// Export the connection pool
const testConnection = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        } else {
            console.log('Connected to MySQL database.');
            connection.release(); // Release connection after checking
        }
    });
};
export { db, testConnection };
