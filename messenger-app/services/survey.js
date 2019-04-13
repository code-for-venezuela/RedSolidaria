'use strict';

// Use dotenv to read .env vars into Node
require('dotenv').config();

// Imports dependencies
const
  Response = require('./response');

module.exports = class Survey {

  static genAgentRating(agent) {
    let response = Response.genQuickReply('Como esta todo?',
      [{
          "title": "😀",
          "payload": "CSAT_GOOD"
        },
        {
          "title": "🙂",
          "payload": "CSAT_AVERAGE"
        },
        {
          "title": "🙁",
          "payload": "CSAT_BAD"
        }
      ]
    )

    // This is only triggered 1 min after talking with an agent
    response.delay = '60000';

    return response;
  }

  static handlePayload(payload) {
    let response;

    switch (payload) {
      case 'CSAT_GOOD':
        response = Response.genText('Que bueno');
        break;

      case 'CSAT_AVERAGE':
        response = Response.genText('survey.neutral');
        break;

      case 'CSAT_BAD':
        response = Response.genQuickReply('survey.negative',
          [{
            "title": i18n.__('menu.help'),
            "payload": "CARE_HELP"
          }]
        )
        break;

      case 'CSAT_SUGGESTION':
        response = Response.genText('survey.suggestion');
        break;
    }

    return response;
  }
}
