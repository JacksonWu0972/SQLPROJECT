document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {
        welcomeMessage.textContent = `Welcome to the Payment Page, ${username}!`;
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Connect to MSSQL before payment processing
            await connectToMSSQL(username);
        });
    }
});

async function connectToMSSQL(username) {
   // const username = document.getElementById('username').value;
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
        const response = await fetch(' https://f619-49-158-79-5.ngrok-free.app/processPayment', {
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
    }
}

// 保留其他代码不变

function displaySuccessMessage() {
    const successMessageContainer = document.getElementById('successMessage');

    if (successMessageContainer) {
        successMessageContainer.textContent = 'Payment successful! Thank you for your purchase.';
    } else {
        console.log('Payment successful! Thank you for your purchase.');
    }
}
