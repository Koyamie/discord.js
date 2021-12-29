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

  handlePacket(packet) {
    console.log(packet);
    if (packet && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, packet.shard_id ?? null);
    }

    return true;
  }
}

module.exports = AmqpManager;
