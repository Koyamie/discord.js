'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class MessageCreateRawAction extends Action {
  handle(data) {
    const client = this.client;

    client.emit(Events.MESSAGE_CREATE_RAW, data);

    return { data };
  }
}

module.exports = MessageCreateRawAction;
