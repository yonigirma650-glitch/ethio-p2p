const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


// Test API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "P2P Backend is running"
  });
});


// Create Order API
app.post("/api/orders", async (req, res) => {
  try {
    const {
      user_id,
      type,
      amount,
      price,
      payment_method
    } = req.body;


    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          type,
          amount,
          price,
          payment_method
        }
      ])
      .select();


    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }


    res.json({
      success: true,
      order: data
    });


  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`P2P Backend running on port ${PORT}`);
});
