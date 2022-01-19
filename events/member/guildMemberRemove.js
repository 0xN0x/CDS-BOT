const { DARK_RED } = require('../../data/colors.json');
const { MessageEmbed } = require("discord.js");
const { CHANNEL } = require('../../config');

module.exports = async (client, member) => {
    const user = client.users.cache.get(member.id);
    const embed = new MessageEmbed()
        .setColor(DARK_RED)
        .setTitle(`Membre parti`)
        .setDescription(`<@${member.id}>`)
        .addFields(
            {name: "Rejoint le", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true},
            {name: `Parti le `, value: `<t:${Math.floor(Date.now() / 1000)}:D>`, inline: true},
            {name: "ID", value: `${member.id}`},
        );

    client.channels.cache.get(CHANNEL.LOGS).send({embeds: [embed]});
}