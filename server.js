
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_K7DRc6FhPmBw@ep-falling-cherry-a5hjfny7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

// Create tables if they don't exist
Promise.all([
  pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `),
  pool.query(`
    CREATE TABLE IF NOT EXISTS visitors (
      id SERIAL PRIMARY KEY,
      count INTEGER DEFAULT 0
    )
  `).then(() => {
    // Insert initial count if table is empty
    return pool.query(`
      INSERT INTO visitors (count)
      SELECT 0
      WHERE NOT EXISTS (SELECT 1 FROM visitors)
    `);
  })
]).catch(err => console.error('Error creating tables:', err));

// Add route to get and update visitor count
app.get('/visitor-count', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE visitors SET count = count + 1 WHERE id = 1');
      const result = await client.query('SELECT count FROM visitors WHERE id = 1');
      await client.query('COMMIT');
      res.json({ count: result.rows[0].count });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error updating visitor count:', err);
    res.status(500).json({ error: 'Failed to update visitor count' });
  }
});

app.post('/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  let client;
  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    client = await pool.connect();
    console.log('Connected to database');
    const result = await client.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [name, email, message]
    );
    console.log('Successfully inserted contact:', result.rows[0]);
    console.log('Insert successful:', result.rows[0]);
    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database error: ' + (error.message || 'Unknown error')
    });
  } finally {
    if (client) {
      try {
        client.release();
        console.log('Database connection released');
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
  }
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
