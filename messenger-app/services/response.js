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

  static genPhoneButton(title, payload) {
    let response = {
      type: "phone_number",
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
    return [
      Response.genQuickReply(
        "¡Bienvenido(a)! Te puedo recomendar servicios disponibles cerca de ti para Venezolanos. Para mejor ayudarte, necesito saber tu ubicación.",
        [
          {
            content_type: "location"
          },
          {
            title: "Por ciudad",
            payload: "SELECT_CITY"
          }
        ]
      )
    ];
  }

  static genCitySelectMessage() {
    let response = Response.genQuickReply("Seleccionar ciudad de una lista", [
      {
        title: "Bogotá",
        payload: "BOGOTA_SELECTED"
      },
      {
        title: "Medellín",
        payload: "MEDELLIN_SELECTED"
      },
      {
        title: "Cartagena",
        payload: "CARTAGENA_SELECTED"
      },
      {
        title: "Cali",
        payload: "CALI_SELECTED"
      },
      {
        title: "Otra ciudad",
        payload: "OTRA_CIUDAD_SELECTED"
      }
    ]);
    return [response];
  }

  static genGotLocationMessage() {
    let response = Response.genQuickReply(
      "¡Gracias! Estas son las categorías de servicios disponibles cerca de tu ubicación:",
      [
        {
          title: "Comida y Agua",
          payload: "COMIDA_Y_AGUA"
        },
        {
          title: "Hospedaje y Albergue",
          payload: "HOSPEDAJE_Y_ALBERGUE"
        },
        {
          title: "Salud",
          payload: "SALUD"
        },
        {
          title: "Educación",
          payload: "EDUCATION"
        },
        {
          title: "Empleo",
          payload: "EMPLOYMENT"
        },
        {
          title: "Inmigración",
          payload: "IMMIGRATION"
        },
        {
          title: "Ver todo",
          payload: "VER_TODO"
        }
      ]
    );
    return [response];
  }

  static genLoggingBogotaMessage() {
    let image_url =
      "https://www.thehotelguru.com/_images/da/5e/da5e7682ad10b966697b6691c762d021/bogota-s1180x560.jpg";
    let title = "Albergue Espiritu Santo";
    let sub_title =
      "Ofrece hospedaje por 24 horas con prioridad para niños, abuelos y mujeres embarazadas. Alimentación";
    let buttons = [
      this.genWebUrlButton("Dirección", "https://goo.gl/maps/kkh3sGEH5iq"),
      this.genPhoneButton("Llamar (313) 811-5707", "+573138115707"),
      this.genPostbackButton("Evaluar", "RATE")
    ];
    let response = Response.genGenericTemplate(
      image_url,
      title,
      sub_title,
      buttons
    );
    return [response];
  }
};
