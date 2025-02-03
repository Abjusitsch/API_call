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

const fetchAndSaveData = async () => {
    try {
        const response = await axios.get('https://api.chucknorris.io/jokes/random');
        const apiData = response.data;
        const { icon_url, id, url, value } = apiData;

        const sql = `INSERT INTO api_data (icon_url, id, url, value) VALUES (?, ?, ?, ?)`;
        connection.query(sql, [icon_url, id, url, value], (error, results) => {
            if (error) {
                console.error('Fehler beim Speichern der Daten:', error);
            }
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
};

app.get('/fetch-and-save', async (req, res) => {
    try {
        await fetchAndSaveData();
        res.json({ message: 'Data fetched and saved' });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen und Speichern der Daten' });
    }
});

app.get('/data', (req, res) => {
    connection.query('SELECT value FROM api_data', (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            res.status(500).json({ error: 'Fehler beim Abrufen der Daten' });
        } else {
            console.log('Daten abgerufen:', results);
            res.json(results);
        }
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
    
    (async () => {
        connection.query('TRUNCATE TABLE api_data', async (error) => {
            if (error) {
                console.error('Fehler beim Löschen', error);
                return;
            }
            console.log('Alte Daten gelöscht');
        
            for (let i = 0; i < 10; i++) {
                await fetchAndSaveData();
                console.log(`${i + 1}/10 geladen`);
            }
        });
    })
});
