const axios = require('axios');

var express = require("express");
var app = express();
var port = process.env.PORT || 4014;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.get("/notify/:location/:title/:code/:telegramId", async (req, res, next) => {
    const params=req.params;
    const available=await checkBooking(params.location,params.title,params.code)
    if(available){
      sendMessage(`Booking Opened for ${params.title.toUpperCase()} 🎬 ✅✅✅`,params.telegramId);
    }
    res.json({"bookingAvailable":!!available});
});

app.get("/notify/:theatre/:movie/:location/:locationCode/:movieCode/:telegramId", async (req, res, next) => {
    const params=req.params;
    const available=await checkTheatreForMovie(params.theatre,params.movie,params.location,params.locationCode,params.movieCode)
    if(available){
      sendMessage(`Booking Opened for ${params.title.toUpperCase()} 🎬 ✅✅✅ in ${theatre}`,params.telegramId);
    }
    res.json({"bookingAvailable":!!available});
});


async function sendMessage(message,chatId){
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

async function checkTheatreForMovie(theatre,movie,location,locationCode,movieCode){
    const res=await axios.get(`https://bms-booking.vercel.app/${theatre}/${movie}/${location}/${locationCode}/${movieCode}`)
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