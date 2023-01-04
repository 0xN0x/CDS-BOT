const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { DARK_RED, CORNFLOWER_BLUE } = require("../data/colors.json");
const { CROSS_MARK } = require('../data/emojis.json');
const { SALON } = require('./constants');

module.exports.sendMPAchievement = async (client, guildId, user, achievement) => {
    let embedAch = new EmbedBuilder()
        .setColor(CORNFLOWER_BLUE)
        .setTitle(`🏆 Succès débloqué 🏆`)
        .addFields(
            { name: `${achievement.title}`, value: `${achievement.desc}`});
    
    const file = new AttachmentBuilder(`data/img/achievements/${achievement.img}.png`)
    embedAch.setThumbnail(`attachment://${achievement.img}.png`)

    await user.send({ embeds: [embedAch], files: [file] });

    // - log
    this.createLogs(client, guildId, '🏆 Succès interne débloqué', 
        `${user} a débloqué :\n
        ***${achievement.title}*** :\n*${achievement.desc}*`, '', CORNFLOWER_BLUE)
}

/**
 * Créer un embed de type ERREUR
 * @param {*} text le texte a afficher
 * @returns un MessageEmbed
 */
module.exports.createError = (text) => {
    let embedError = new EmbedBuilder()
        .setColor(DARK_RED)
        .setDescription(`${CROSS_MARK} • ${text}`);
    return embedError;
}

/**
 * Envoie un message d'erreur
 * @param {*} message objet Discord, va envoyé le message dans le même channel
 * @param {*} text le message
 * @param {*} cmd le nom de la commande qui a exécuté cet envoi
 * @returns 
 */
module.exports.sendError = (message, text, cmd) => {
    let embedError = this.createError(text);
    logger.error(`${message.author.username} - ${cmd} : ${text}`);
    return message.channel.send({ embeds: [embedError] });
}

/**
 * Envoie un message dans le channel de log
 * @param {*} client objet Discord, va envoyé le message dans le channel
 * @param {*} embedLog
 * @returns 
 */
module.exports.sendLogs = async (client, guildId, embedLog) => {
    const idLogs = await client.getGuildChannel(guildId, SALON.LOGS);
    if (idLogs)
        await client.channels.cache.get(idLogs).send({ embeds: [embedLog] });
    else
        logger.error(`- Config salon logs manquante !`);
}

/**
 * Créé un log (embed) prédéfini
 * @param {*} client objet Discord, va envoyé le message dans le channel
 * @param {*} guildId id de la guilde
 * @param {*} title le titre
 * @param {*} desc le msg du log
 * @param {*} footer facultatif (defaut '')
 * @param {*} color facultatif (defaut DARK_RED)
 * @returns 
 */
 module.exports.createLogs = async (client, guildId, title, desc, footer = '', color = DARK_RED) => {
    let embedLog = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${title}`)
        .setDescription(desc);
    
    if (footer)
        embedLog.setFooter({ text: footer });
    await this.sendLogs(client, guildId, embedLog);
}