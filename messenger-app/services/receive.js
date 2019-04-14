"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

const Response = require("./response"),
  Survey = require("./survey"),
  GraphAPi = require("./graph-api");

module.exports = class Receive {
  constructor(senderPsid, webhookEvent) {
    this.senderPsid = senderPsid;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;
    let responses = new Array();

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = responses.concat(this.handleQuickReply());
        } else if (message.attachments) {
          responses = responses.concat(this.handleAttachmentMessage());
        } else if (message.text) {
          responses = responses.concat(this.handleTextMessage());
        }
      } else if (event.postback) {
        responses = responses.concat(this.handlePostback());
      } else if (event.referral) {
        responses = responses.concat(this.handleReferral());
      }
    } catch (error) {
      console.error(error);
      responses = [
        {
          text: `An error has occured: '${error}'. We have been notified and will fix the issue shortly!`
        }
      ];
    }
    console.log("handleMessage", responses);
    let message_counter = 0;
    for (let response of responses) {
      this.sendMessage(response, 800 * message_counter);
      message_counter++;
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(this.webhookEvent.message.text);

    // check greeting is here and is confident
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");

    let message = this.webhookEvent.message.text.trim().toLowerCase();

    let responses;

    if (greeting && greeting.confidence > 0.8) {
      responses = Response.genNuxMessages();
    } else {
      responses = [Response.genText(`No entiendo ${message}`)].concat(
        Response.genNuxMessages()
      );
      console.log("estoy aqui", responses);
    }

    return responses;
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log(attachment);

    response = Response.genQuickReply("enviaste un attachment", [
      {
        title: "primer",
        payload: "FIRST_PAYLOAD"
      },
      {
        title: "segundo",
        payload: "SECOND_PAYLOAD"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;
    console.log(payload);

    return this.handlePayload(payload);
  }

  // Handles postbacks events
  handlePostback() {
    // Get the payload of the postback
    let payload = this.webhookEvent.postback.payload;

    return this.handlePayload(payload);
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log(payload);

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.senderPsid, payload);

    let response;

    // Set the response based on the payload
    switch (payload) {
      case "GET_STARTED":
        responses = Response.genNuxMessages();
        break;

      default:
        responses = [
          {
            text: "This is a default postback message!"
          }
        ];
    }

    if (payload.includes("CSAT")) {
      responses = Survey.handlePayload(payload);
    }

    return responses;
  }

  sendMessage(response, delay = 0) {
    console.log("response: ", response);
    if (!response) {
      console.log("sendMessage was called without a response");
      return;
    }

    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.senderPsid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.senderPsid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
