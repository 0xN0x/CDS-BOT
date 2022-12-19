const { GREEN } = require('../../data/colors.json');
const { EmbedBuilder } = require("discord.js");
const { sendLogs } = require('../../util/envoiMsg');

module.exports = async (client, ban) => {
    const embedLog = new EmbedBuilder()
        .setColor(GREEN)
        .setAuthor(`Membre débanni`, ban.user.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
        .setThumbnail(ban.user.displayAvatarURL({dynamic : true, size: 4096, format: 'png'}))
        .setDescription(`<@${ban.user.id}>\n`)
        .addFields(
            {name: "Membre", value: `\`${ban.user.tag}\` - <@${ban.user.id}>`, inline: true},
        )
        .setFooter({text: `ID: ${ban.user.id}`})
        .setTimestamp();

    sendLogs(client, ban.guild.id, embedLog);
}