var express = require('express');
var app = express();
const port = process.env.PORT || 5000;

const { Client } = require('pg');

const credentials = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'kimha29092003',
    port: 5432,
};

const client = new Client(credentials);

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

app.listen(5000, function () {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/getFruitData/:fruitCode', async function(req, res) {
    const fruitCode = req.params.fruitCode; // Correctly extracting the parameter

    try {

        const query = 'SELECT * FROM "products" WHERE barcode = $1'; //parameterized query-> to prevent SQL injection
        const values = [fruitCode];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send('Fruit not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database query error', error.stack);
        res.status(500).send('Internal server error');
    }
});

const queryDb = async(tab, val) => {
    try {
        const query = 'SELECT * FROM ' + tab + ' WHERE MSP = $1';
        const values = [val];

        const result = await client.query(query, values);
        console.log(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
}

// queryDb("Fruits", "some_fruit_code"); // Replace "some_fruit_code" with an actual fruit code