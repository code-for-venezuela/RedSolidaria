"use strict";

const person = require("./person");

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      if (
        "content_type" in quickReply &&
        quickReply["content_type"] == "location"
      ) {
        response["quick_replies"].push({
          content_type: "location"
        });
      } else {
        response["quick_replies"].push({
          content_type: "text",
          title: quickReply["title"],
          payload: quickReply["payload"]
        });
      }
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url
    };

    return response;
  }

  static genNuxMessages() {
    let welcome = this.genText(
      "Bienvenido a Diaspora Venezuela, soporte a los inmigrantes"
    );

    let guide = Response.genQuickReply("Indicanos tu ubicación", [
      {
        content_type: "location"
      },
      {
        title: "No quiero indicar mi ubicación",
        payload: "NO_LOCATION"
      }
    ]);

    return [welcome, guide];
  }
};
