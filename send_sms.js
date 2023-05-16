"use strict";
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const {TWILIO_ACCOUNT_SID , TWILIO_AUTH_TOKEN} = require("./config")
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+18776065294',
     to: '+16262589686'
   })
  .then(message => console.log(message.sid));
