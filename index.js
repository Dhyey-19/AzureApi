const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // must be a string
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

app.get('/', async (req, res) => {
  try {
   
    res.json({"hi":"hi"});
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});
app.get('/applications', async (req, res) => {
  try {
    console.log('Connecting to SQL Server...');
    await sql.connect(config);
    const result = await sql.query`SELECT APPNAME FROM DTAPPLICATIONS`;
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API is running on port ${port}`);
});

