const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.use(express.json());
app.use(cors());


// =======================
// SUPABASE
// =======================

const supabase = createClient(
  "SUPABASE_URL_KEE",https://gfgfiuwarbvzybngzrms.supabase.co
  "SUPABASE_ANON_KEY_KEE"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZ2ZpdXdhcmJ2enlibmd6cm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzOTUzOTQsImV4cCI6MjEwNTk3MTM5NH0.TjEnGKw5XrX1DMoy1Pmk1riA-EaDUMXz3pKkyjkd_lM
);


// =======================
// TELEGRAM BOT
// =======================

const BOT_TOKEN = "TOKEN_KEE";8669113896:AAHSbZASGWAf05QthiuPmSp62zbmBSHPHLc

const bot = new TelegramBot(BOT_TOKEN,{
  polling:true
});


const BACKEND_URL =
"https://ethio-p2p-9pav.onrender.com";



bot.on("message", async(msg)=>{

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


  }catch(error){

   bot.sendMessage(
    chatId,
    "Ads argachuu hin dandeenye ❌"
   );

  }

 }


});



// =======================
// HOME
// =======================

app.get("/",(req,res)=>{

 res.send(
  "Ethio P2P Backend Running ✅"
 );

});



// =======================
// HEALTH CHECK
// =======================

app.get("/api/health",(req,res)=>{

 res.json({

  success:true,

  message:
  "P2P Backend is running"

 });

});



// =======================
// GET ADS
// =======================

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



// =======================
// CREATE AD
// =======================

app.post("/api/ads", async(req,res)=>{


 const ad=req.body;


 const {data,error}=await supabase

 .from("ads")

 .insert([ad])

 .select();


 if(error){

  return res.status(400).json({

   error:error.message

  });

 }


 res.json({

  success:true,

  ad:data

 });


});



// =======================
// ORDERS
// =======================

app.get("/api/orders", async(req,res)=>{


 const {data,error}=await supabase

 .from("orders")

 .select("*");


 if(error){

  return res.status(400).json({

   error:error.message

  });

 }


 res.json(data);


});




app.post("/api/orders", async(req,res)=>{


 const order=req.body;


 const {data,error}=await supabase

 .from("orders")

 .insert([order])

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



// =======================
// WALLET TRANSACTION
// =======================

app.post("/api/transaction",(req,res)=>{


const {
 amount,
 type

}=req.body;


let fee=0;


if(type==="deposit"){

 fee=0;

}


if(type==="withdraw"){

 fee=0.5;

}


const receive =
amount-fee;


res.json({

 success:true,

 amount:amount,

 fee:fee,

 receive:receive

});


});



// =======================
// VERIFY ACCOUNT
// =======================

app.post("/api/verify-account",
(req,res)=>{


const {
 fullName,
 phoneNumber

}=req.body;



console.log(
"VERIFY:",
fullName,
phoneNumber
);



res.json({

success:true,

message:
"Verification received"

});


});




// =======================
// START SERVER
// =======================

const PORT =
process.env.PORT || 3000;


app.listen(PORT,()=>{


console.log(
`Server running on ${PORT}`
);


});
