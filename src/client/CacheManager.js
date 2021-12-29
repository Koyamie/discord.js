'use strict';

const { RainCache, RedisStorageEngine: Redis } = require('raincache');

class CacheManager {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });

    this.cache = new RainCache({
      storage: {
        default: new Redis({
          redisOptions: this.client.config.redis
        }),
      },
    });

    this.cache.initialize();
  }
}

module.exports = CacheManager;
