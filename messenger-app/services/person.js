'use strict';

module.exports = {
  firstName: '',
  lastName: '',
  psid: '',

  setProfile(profile) {
    this.firstName = profile.firstName
    this.lastName = profile.lastName
    this.psid = profile.id
  }
}
