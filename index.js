const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json()); // to parse JSON body

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Health check
app.get('/', (req, res) => {
  res.json({ "hi": "hi" });
});

// Static test route
app.get('/applications', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM DTAPPLICATIONS`;
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Dynamic SQL query route
app.post('/runquery', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing SQL query' });
  }

  try {
    await sql.connect(config);
    const result = await sql.query(query);

    // Return appropriate response based on the type of query
    if (query.trim().toLowerCase().startsWith('select')) {
      res.json({ data: result.recordset });
    } else {
      res.json({
        message: 'Query executed successfully',
        rowsAffected: result.rowsAffected
      });
    }

  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API is running on port ${port}`);
});
