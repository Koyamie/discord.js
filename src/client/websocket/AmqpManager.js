'use strict';

const { AmqpConnector } = require('raincache');
const PacketHandlers = require('./handlers');

class AmqpManager {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });

    this.connector = null;
  }

  async connect() {
    this.connector = new AmqpConnector({
      amqpQueue: 'test-post-cache',
    });
    await this.connector.initialize();
    this.connector.on('event', this.handlePacket.bind(this));
  }

  async handlePacket(packet) {
    console.log(packet);
    if (packet && PacketHandlers[packet.t]) {
      if (packet.d.guild_id) {
        await this.initGuild(packet.d);
      }
      PacketHandlers[packet.t](this.client, packet, packet.shard_id ?? null);
    }

    return true;
  }

  async initGuild(data) {
    const id = data.guild_id ?? data.id;
    if (!this.client.guilds.cache.has(id)) {
      let guild = await this.client.raincache.guild.get(id);
      if (guild) {
        guild = this.client.guilds._add(guild);
        const roles = await this.client.raincache.role.filter(r => r, guild.id);
        for (const role of roles) guild.roles._add(role);
        const channels = await this.client.raincache.channel.filter(c => c.guild_id === guild.id);
        for (const channel of channels) this.client.channels._add(channel);
      }
    }
  }
}

module.exports = AmqpManager;
