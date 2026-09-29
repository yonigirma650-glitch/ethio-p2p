const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());
app.use(cors());

// Supabase connection
const supabase = createClient(
  "https://gfgfiuwarbvzybngzrms.supabase.co",
  "sb_publishable_d9hLjHnekNm8HVYT2qgC4g_RaS99HsG"
);


// Test server
app.get("/", (req, res) => {
  res.send("Ethio P2P Server is running successfully!");
});


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "P2P Backend is running"
  });
});


// Create order
app.post("/api/orders", async (req, res) => {

  const orderData = req.body;

  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select();

  if (error) {
    return res.status(400).json({
      error: error.message
    });
  }

  res.json({
    success: true,
    order: data
  });

});


// Transaction
app.post("/api/transaction", (req, res) => {

  const { amount, type } = req.body;

  let commission = 0;

  if (type === "deposit") {
    commission = 0.2;
  } 
  else if (type === "withdraw") {
    commission = 0.5;
  } 
  else {
    return res.status(400).json({
      error: "Invalid transaction type"
    });
  }


  const finalAmount = amount - commission;


  res.json({
    success: true,
    requestedAmount: amount,
    commissionFee: commission,
    payoutAmount: finalAmount
  });

});


// Verify account
app.post("/api/verify-account", (req, res) => {

  const { fullName, phoneNumber } = req.body;

  console.log("Verify Request:", fullName, phoneNumber);

  res.json({
    success: true,
    message: "Verification details received successfully!"
  });

});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
