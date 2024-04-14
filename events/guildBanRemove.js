const { GREEN } = require("../data/colors.json");
const { EmbedBuilder, Events } = require("discord.js");
const { sendLogs } = require("../util/envoiMsg");

module.exports = {
    name: Events.GuildBanRemove,
    execute(ban) {
        const embedLog = new EmbedBuilder()
            .setColor(GREEN)
            .setAuthor({
                name: "Membre débanni",
                iconURL: ban.user.displayAvatarURL({
                    dynamic: true,
                    size: 4096,
                    format: "png",
                }),
            })
            .setThumbnail(
                ban.user.displayAvatarURL({
                    dynamic: true,
                    size: 4096,
                    format: "png",
                }),
            )
            .setDescription(ban.user.toString())
            .addFields({
                name: "Membre",
                value: `\`${ban.user.tag}\` - ${ban.user}`,
                inline: true,
            })
            .setFooter({ text: `ID: ${ban.user.id}` })
            .setTimestamp();

        sendLogs(ban.client, ban.guild.id, embedLog);
    },
};
