const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.use(express.json());
app.use(cors());


// ==========================
// SUPABASE
// ==========================
const supabase = createClient(
  "SUPABASE_URL_KEE",https://gfgfiuwarbvzybngzrms.supabase.co
  "SUPABASE_KEY_KEE"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZ2ZpdXdhcmJ2enlibmd6cm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTUzOTQsImV4cCI6MjEwNTk3MTM5NH0.TjEnGKw5XrX1DMoy1Pmk1riA-EaDUMXz3pKkyjkd_lM
);


// ==========================
// TELEGRAM BOT
// ==========================

// ASITTI TOKEN GALCHI
const BOT_TOKEN = "8669113896:AAHSbZASGWAf05QthiuPmSp62zbmBSHPHLc";

const bot = new TelegramBot(BOT_TOKEN, {
  polling: true
});

const BACKEND_URL = "https://ethio-p2p-9pav.onrender.com";


bot.on("message", async (msg)=>{

  const chatId = msg.chat.id;
  const text = msg.text;


  if(text === "/start"){
    bot.sendMessage(
      chatId,
      "Ethio P2P Bot irratti baga dhuftan ✅"
    );
  }


  if(text === "/ads"){

    try{

      const response = await fetch(
        `${BACKEND_URL}/api/ads`
      );

      const data = await response.json();

      bot.sendMessage(
        chatId,
        JSON.stringify(data,null,2)
      );

    }catch(err){

      bot.sendMessage(
        chatId,
        "Ads argachuu hin dandeenye ❌"
      );

    }
  }

});



// ==========================
// TEST SERVER
// ==========================

app.get("/",(req,res)=>{
 res.send(
  "Ethio P2P Backend running"
 );
});



// ==========================
// HEALTH
// ==========================

app.get("/api/health",(req,res)=>{
 res.json({
  success:true,
  message:"P2P Backend is running"
 });
});



// ==========================
// ADS
// ==========================

app.get("/api/ads", async(req,res)=>{

 const {data,error}=await supabase
 .from("ads")
 .select("*");


 if(error){
  return res.status(400).json({
   error:error.message
  });
 }


 res.json(data);

});



// ==========================
// CREATE ORDER
// ==========================

app.post("/api/orders",async(req,res)=>{

 const orderData=req.body;


 const {data,error}=await supabase
 .from("orders")
 .insert([orderData])
 .select();


 if(error){
  return res.status(400).json({
   error:error.message
  });
 }


 res.json({
  success:true,
  order:data
 });


});



// ==========================
// TRANSACTION
// ==========================

app.post("/api/transaction",(req,res)=>{

const {amount,type}=req.body;


let commission=0;


if(type==="deposit"){
 commission=0.2;
}

else if(type==="withdraw"){
 commission=0.5;
}

else{

return res.status(400).json({
 error:"Invalid transaction type"
});

}


const finalAmount=amount-commission;


res.json({

success:true,
requestedAmount:amount,
commissionFee:commission,
payoutAmount:finalAmount

});


});



// ==========================
// VERIFY ACCOUNT
// ==========================

app.post("/api/verify-account",(req,res)=>{

const {fullName,phoneNumber}=req.body;


console.log(
"Verify Request:",
fullName,
phoneNumber
);


res.json({

success:true,
message:
"Verification details received successfully"

});


});



// ==========================
// START SERVER
// ==========================

const PORT=process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log(
`Backend running on port ${PORT}`
);

});
