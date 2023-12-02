async function getDynamicUrl() {
    try {
        const response = await fetch('/api/getDynamicUrl');
        const data = await response.json();

        if (data && data.url) {
            return data.url;
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Error fetching dynamic URL:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {
        welcomeMessage.textContent = `Welcome to the Payment Page, ${username}!`;
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // 使用 Promise 解决异步问题
            getDynamicUrl().then((dynamicUrl) => {
                return connectToMSSQL(dynamicUrl, username);
            }).then(() => {
                // 在这里处理后续异步操作，如果有的话
            }).catch((error) => {
                console.error('Error in form submission:', error);
                alert('An error occurred. Please try again.');
                // 返回一个 rejected 的 Promise 中止 Promise 链的执行
                return Promise.reject(error);
            });
        });
    }
});

async function connectToMSSQL(url, username) {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    const paymentData = {
        username: username,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv
        // 添加其他支付信息
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        const result = await response.json();

        if (result.success) {
            displaySuccessMessage();
        } else {
            console.error('Payment failed:', result.message);
            alert('Payment failed!');
        }
    } catch (err) {
        console.error('Error connecting to server:', err);
        alert('Connection to server failed!');
        // 返回一个 rejected 的 Promise 中止 Promise 链的执行
        return Promise.reject(err);
    }
}

function displaySuccessMessage() {
    const successMessageContainer = document.getElementById('successMessage');

    if (successMessageContainer) {
        successMessageContainer.textContent = 'Payment successful! Thank you for your purchase.';
    } else {
        console.log('Payment unsuccessful! Thank you for your purchase.');
    }
}
