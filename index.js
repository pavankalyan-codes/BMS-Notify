const axios = require('axios');

var express = require("express");
var app = express();
var port = process.env.PORT || 4014;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.get("/notify/:location/:title/:code", async (req, res, next) => {
    const params=req.params;
    const available=await checkBooking(params.location,params.title,params.code)
    if(available){
      sendMessage();
    }
    res.json({"bookingAvailable":!!available});
});


async function sendMessage(message="Booking Available",chatId="738318805"){
    const resp=await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,{
        chat_id:chatId,
        text:message
    })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        return error;
    })
    return resp;
}


async function checkBooking(location,title,code){
    const res=await axios.get(`https://bms-booking.vercel.app/bms/${location}/${title}/${code}`)
    .then((response)=> {
        return response.data.bookingAvailable;
    })
    .catch(function (error) {
        return false;
    })
    return res;
}


app.listen(port, () => {
    console.log("Server runnning on port " + port);
});