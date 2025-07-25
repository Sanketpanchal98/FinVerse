import app from './app.js';
import dotenv from 'dotenv';
import DataBaseConnection from './DB/DataBase.js';

dotenv.config();

let dbConnected = false;

export default async function handler(req, res) {
  try {
    if (!dbConnected) {
      await DataBaseConnection();
      dbConnected = true;
    }

    return app(req, res);  // delegate to Express
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
