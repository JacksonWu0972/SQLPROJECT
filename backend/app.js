const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8'); // 或者使用 'tedious'，根據你的選擇
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.options('*', cors()); // 將 OPTIONS 請求路由到 CORS 中間件

const config = {
    server: 'JACKSONWU\\SQLEXPRESS',
    database: 'test',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    },
};

app.post('/processPayment', async (req, res) => {
    const { username, cardNumber, expiryDate, cvv } = req.body;

    try {
        const pool = await new sql.ConnectionPool(config).connect();
        const request = pool.request();

        const query = 'INSERT INTO PaymentTable (username,cardNumber,expiryDate, cvv) VALUES (@username,@cardNumber,@expiryDate, @cvv)';
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


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
