"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

// Imports dependencies
const request = require("request"),
  camelCase = require("camelcase"),
  M_PLATFORM_DOMAIN = "https://graph.facebook.com",
  M_PLATFORM_VERSION = "v3.2",
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  APP_ID = process.env.APP_ID,
  PAGE_ID = process.env.PAGE_ID;

module.exports = class GraphAPi {
  static callSendAPI(requestBody) {
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: `${M_PLATFORM_DOMAIN}/${M_PLATFORM_VERSION}/me/messages`,
        qs: {
          access_token: PAGE_ACCESS_TOKEN
        },
        method: "POST",
        json: requestBody
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callMessengerProfileAPI(requestBody) {
    // Send the HTTP request to the Messenger Profile API
    request(
      {
        uri: `${M_PLATFORM_DOMAIN}/${M_PLATFORM_VERSION}/me/messenger_profile`,
        qs: {
          access_token: PAGE_ACCESS_TOKEN
        },
        method: "POST",
        json: requestBody
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static async getPersonProfile(senderPsid) {
    try {
      const personProfile = await this.callPersonProfileAPI(senderPsid);

      for (const key in personProfile) {
        const camelizedKey = camelCase(key);
        const value = personProfile[key];
        delete personProfile[key];
        personProfile[camelizedKey] = value;
      }

      return personProfile;
    } catch (err) {
      console.log("Fetch failed:", err);
    }
  }

  static callPersonProfileAPI(senderPsid) {
    return new Promise(function(resolve, reject) {
      let body = [];

      // Send the HTTP request to the Graph API
      request({
        uri: `${M_PLATFORM_DOMAIN}/${M_PLATFORM_VERSION}/${senderPsid}`,
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: "first_name, last_name, profile_pic"
        },
        method: "GET"
      })
        .on("response", function(response) {
          console.log(response.statusCode);

          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function(chunk) {
          body.push(chunk);
        })
        .on("error", function(error) {
          console.error("Unable to fetch profile:" + error);
          reject(Error("Network Error"));
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          console.log(JSON.parse(body));

          resolve(JSON.parse(body));
        });
    });
  }
};
