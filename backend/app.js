const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors({ origin: '*' }));

app.use(bodyParser.json());
app.options('*', cors());

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

// 修改此处，使服务器监听所有可用的网络接口
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});
