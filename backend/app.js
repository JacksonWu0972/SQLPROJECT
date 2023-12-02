const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
const port = 8080;

let dynamicEndpoint = '/processPayment'; // 初始端點，可以根據需要修改

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const config = {
    server: 'JACKSONWU\\SQLEXPRESS',
    database: 'test',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    },
};

app.post(dynamicEndpoint, async (req, res) => {
    const { username, cardNumber, expiryDate, cvv } = req.body;

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        const request = pool.request();

        const query = 'INSERT INTO PaymentTable (username, cardNumber, expiryDate, cvv) VALUES (@username, @cardNumber, @expiryDate, @cvv)';
        request.input('username', sql.NVarChar, username);
        request.input('cardNumber', sql.NVarChar, cardNumber);
        request.input('expiryDate', sql.NVarChar, expiryDate);
        request.input('cvv', sql.NVarChar, cvv);

        const result = await request.query(query);
        await pool.close();

        res.status(200).json({ success: true, message: 'Payment successful!' });
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ success: false, message: 'Payment failed!', error: err.message });
    }
});

// 動態更改端點的路由
app.post('/updateEndpoint', (req, res) => {
    const { newEndpoint } = req.body;
    dynamicEndpoint = newEndpoint;
    res.status(200).json({ success: true, message: 'Endpoint updated successfully!' });
});

/*app.listen(port, '140.136.228.77', () => {
    console.log(`Server is running at http://140.136.228.77:${port}`);
});
*/