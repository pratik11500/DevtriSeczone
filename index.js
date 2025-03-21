const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Replace with your Neon connection string
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_K7DRc6FhPmBw@ep-falling-cherry-a5hjfny7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
});

// Middleware to parse JSON
app.use(express.json());

// Increment visitor count
app.post('/increment', async (req, res) => {
    try {
        const client = await pool.connect();
        await client.query('UPDATE visitor_counter SET visit_count = visit_count + 1, last_updated = NOW() WHERE id = 1');
        client.release();
        res.status(200).send('Visitor count incremented');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get live visitor count
app.get('/count', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT visit_count FROM visitor_counter WHERE id = 1');
        client.release();
        res.status(200).json({ count: result.rows[0].visit_count });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
