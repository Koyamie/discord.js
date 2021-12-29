'use strict';

const process = require('node:process');
const Action = require('./Action');
const { Events } = require('../../util/Constants');

let deprecationEmitted = false;

class MessageCreateAction extends Action {
  async handle(data) {
    const client = this.client;
    if (data.guild_id) {
      if (!client.guilds.cache.has(data.guild_id)) {
        const guild = await client.raincache.guild.get(data.guild_id);
        if (guild) {
          guild = client.guilds._add(guild);
        }
      }
    }
    let channel = await client.raincache.channel.get(data.channel_id);
    if (channel) {
      channel = client.channels._add(channel, null, { cache: false });
    } else {
      channel = this.getChannel(data);
    }
    if (channel) {
      if (!channel.isText()) return {};

      const existing = channel.messages.cache.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages._add(data);
      channel.lastMessageId = data.id;

      /**
       * Emitted whenever a message is created.
       * @event Client#messageCreate
       * @param {Message} message The created message
       */
      client.emit(Events.MESSAGE_CREATE, message);

      /**
       * Emitted whenever a message is created.
       * @event Client#message
       * @param {Message} message The created message
       * @deprecated Use {@link Client#event:messageCreate} instead
       */
      if (client.emit('message', message) && !deprecationEmitted) {
        deprecationEmitted = true;
        process.emitWarning('The message event is deprecated. Use messageCreate instead', 'DeprecationWarning');
      }

      return { message };
    }

    return {};
  }
}

module.exports = MessageCreateAction;
