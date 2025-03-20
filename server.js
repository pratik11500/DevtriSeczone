
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_K7DRc6FhPmBw@ep-falling-cherry-a5hjfny7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

// Create contacts table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Error creating table:', err));

app.post('/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [name, email, message]
    );
    console.log('Successfully inserted contact:', result.rows[0]);
    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database error: ' + (error.message || 'Unknown error')
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
