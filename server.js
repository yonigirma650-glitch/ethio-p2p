const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    console.log("New Order Received:", orderData);
    res.json({ status: "success", message: "Order created successfully!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
