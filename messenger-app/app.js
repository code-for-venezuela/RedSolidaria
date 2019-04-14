"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

// Imports dependencies and set up http server
const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  path = require("path"),
  GraphAPi = require("./services/graph-api"),
  Receive = require("./services/receive"),
  person = require("./services/person"),
  app = express(),
  persons = {};

// Parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: true
  })
);

// Parse application/json
app.use(json());

// Serving static files in Express
app.use(express.static(path.join(__dirname, "public")));

// Set template emgine in Express
app.set("view engine", "ejs");

// Respond with index file when a GET request is made to the homepage
app.get("/", function(_req, res) {
  res.render("index");
});

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  console.log("GET req");

  res.sendStatus(403);
});

// Creates the endpoint for webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks if this is an event from a page subscription
  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];

      // ditch uninteresting events
      if ("read" in webhookEvent) {
        console.log("got a read");
        return;
      }
      if ("delivery" in webhookEvent) {
        console.log("got a delivery");
        return;
      }
      console.log("webhookEvent: ", webhookEvent);

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;
      console.log("Sender PSID: " + senderPsid);
      console.log("status of persons", persons);
      console.log("have i seen the person", senderPsid in persons);

      // Check if this is the first time I'm seing this person
      if (!(senderPsid in persons)) {
        console.log("Have not seen this person before ", senderPsid);
        GraphAPi.getPersonProfile(senderPsid).then(personProfile => {
          person.setProfile(personProfile);
          console.log("adding ", person.psid);
          persons[senderPsid] = person;
          let receiveMessage = new Receive(senderPsid, webhookEvent);
          return receiveMessage.handleMessage();
        })
        .catch(err =>{
          persons[senderPsid] = persons.setEmptyProfile(senderPsid);
        });
      }

      let receiveMessage = new Receive(senderPsid, webhookEvent);
      return receiveMessage.handleMessage();
    });
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
