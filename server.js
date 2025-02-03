const express = require('express');
const axios = require('axios');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api_data'
});

app.get('/fetch-and-save', async (req, res) => {
    try {
        const response = await axios.get('https://api.chucknorris.io/jokes/random');
        const apiData = response.data;
        const { icon_url, id, url, value } = apiData;
        

        const sql = `INSERT INTO api_data (icon_url, id, url, value) VALUES (?, ?, ?, ?)`;
        
        connection.query(sql, [icon_url, id, url, value], (error, results) => {
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
});

app.get('/data', (req, res) => {
    connection.query('SELECT value FROM api_data', (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);;
        } else {
            console.log('Daten abgerufen:', results);
            res.json(results);
        }
    });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
