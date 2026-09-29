const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  "SUPABASE_URL_KEE",
  "SUPABASE_ANON_KEY_KEE"
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
