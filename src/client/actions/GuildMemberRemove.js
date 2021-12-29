'use strict';

const Action = require('./Action');
const { deletedGuildMembers } = require('../../structures/GuildMember');
const { Events } = require('../../util/Constants');

class GuildMemberRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let member = null;
    if (guild) {
      member = this.getMember({ user: data.user }, guild);
      guild.memberCount--;
      if (member) {
        deletedGuildMembers.add(member);
        guild.members.cache.delete(member.id);
        /**
         * Emitted whenever a member leaves a guild, or is kicked.
         * @event Client#guildMemberRemove
         * @param {GuildMember} member The member that has left/been kicked from the guild
         */
        client.emit(Events.GUILD_MEMBER_REMOVE, member);
      }
      guild.voiceStates.cache.delete(data.user.id);
    }
    return { guild, member };
  }
}

module.exports = GuildMemberRemoveAction;
