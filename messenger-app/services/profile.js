'use strict';

// Use dotenv to read .env vars into Node
require('dotenv').config();

// Imports dependencies
const
  GraphAPi = require('./graph-api'),
  i18n = require('../i18n.config'),
  locales = i18n.getLocales(),
  SHOP_URL = process.env.SHOP_URL;

module.exports = class Profile {

  setThread() {
    this.setGreeting();
    this.setPersistentMenu();
    this.setGetStarted()
  }

  setGreeting() {
    let greetings = [];

    for (let locale of locales) {
      greetings.push(this.getGreetingText(locale))
    }

    let greetingPayload = {
      'greeting': greetings
    }

    GraphAPi.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuItems = [];

    for (let locale of locales) {
      menuItems.push(this.getMenuItems(locale))
    }

    let menuPayload = {
      'persistent_menu': menuItems
    }

    GraphAPi.callMessengerProfileAPI(menuPayload);
  }

  setGetStarted() {
    let getStartedPayload = {
      'get_started': {
        'payload': 'GET_STARTED'
      }
    }

    GraphAPi.callMessengerProfileAPI(getStartedPayload);
  }

  getGreetingText(locale) {
    let param = locale === 'en_US' ? 'default' : locale;

    i18n.setLocale(locale);

    let localizedGreeting = {
      'locale': param,
      'text': i18n.__('profile.greeting', {
        user_first_name: '{{user_first_name}}'
      })
    }

    console.log(localizedGreeting);
    return localizedGreeting;
  }

  getMenuItems(locale) {
    let param = locale === 'en_US' ? 'default' : locale;

    i18n.setLocale(locale);

    let localizedMenu = {
      'locale': param,
      'composer_input_disabled': false,
      'call_to_actions': [{
          'title': i18n.__('menu.support'),
          'type': 'nested',
          'call_to_actions': [{
              'title': i18n.__('menu.order'),
              'type': 'postback',
              'payload': 'TRACK_ORDER'
            },
            {
              'title': i18n.__('menu.help'),
              'type': 'postback',
              'payload': 'CARE_HELP'
            }
          ]
        },
        {
          'title': i18n.__('menu.suggestion'),
          'type': 'postback',
          'payload': 'CURATION'
        },
        {
          'type': 'web_url',
          'title': i18n.__('menu.shop'),
          'url': SHOP_URL,
          'webview_height_ratio': 'full'
        }
      ]
    }

    console.log(localizedMenu);
    return localizedMenu;
  }
}
