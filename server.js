const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Ethio P2P Server is running successfully!');
});

app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    console.log('New Order Received:', orderData);
    res.json({ status: 'success', message: 'Order created successfully!' });
});

app.post('/api/transaction', (req, res) => {
    const { amount, type } = req.body;
    let commission = 0;

    if (type === 'deposit') {
        commission = 0.2;
    } else if (type === 'withdraw') {
        commission = 0.5;
    } else {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }

    const finalAmount = amount - commission;

    res.json({
        status: 'success',
        requestedAmount: amount,
        commissionFee: commission,
        payoutAmount: finalAmount > 0 ? finalAmount : 0
    });
});

app.post('/api/verify-account', (req, res) => {
    const { fullName, phoneNumber } = req.body;
    console.log('Verification Request:', { fullName, phoneNumber });
    res.json({ status: 'success', message: 'Verification details received successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
