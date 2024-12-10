import { findUserByMobile } from '../models/authModel.js';

export const login = (req, res) => {
    const { number } = req.body;

    if (!number) {
        return res.status(400).json({ error: 'Mobile number is required' });
    }

    // Pass a callback to handle the result of findUserByMobile
    findUserByMobile(number, (error, user) => {
        if (error) {
            console.error(`Error during login: ${error.message}`);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Login successful', user });
    });
};
