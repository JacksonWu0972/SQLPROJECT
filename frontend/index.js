const sql = require('mssql/msnodesqlv8');

// 創建數據庫配置
const config = {
    server: 'JACKSONWU\\SQLEXPRESS',
    database: 'databasetextbook',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    },
}

// 建立連接
sql.connect(config, function (err) {
    if (err) {
        console.log('連接到 SQL Server 時出錯：', err);
    } else {
        // 創建一個新的請求對象
        const request = new sql.Request();

        // 指定查詢
        const query = 'SELECT name  FROM student';

        // 執行查詢
        request.query(query, function (err, records) {
            
            if (err) {
                console.log('執行查詢時出錯：', err);
            } else {
                console.log(records);
                // 查詢的結果
            }

            // 關閉連接
            sql.close();
        });
    }
});