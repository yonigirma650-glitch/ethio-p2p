const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  "SUPABASE_URL_KEE",sb_publishable_d9hLjHnekNm8HVYT2qgC4g_RaS99HsG
  "SUPABASE_ANON_key_kee"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZ2ZpdXdhcmJ2enlibmd6cm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTUzOTQsImV4cCI6MjEwNTk3MTM5NH0.TjEnGKw5XrX1DMoy1Pmk1riA-EaDUMXz3pKkyjkd_lM
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "P2P Backend is running"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`P2P Backend running on port ${PORT}`);
});
