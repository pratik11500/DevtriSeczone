
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('./'));
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_K7DRc6FhPmBw@ep-falling-cherry-a5hjfny7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
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
`);

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    res.json({ success: false });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
