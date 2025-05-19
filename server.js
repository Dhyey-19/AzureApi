const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, // e.g., dhyeyserver.database.windows.net
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

app.get('/applications', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM DTAPPLICATIONS`;
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
