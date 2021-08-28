const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const colors = require('../../data/colors.json');
const { MESSAGES, NB_MAX } = require('../../util/constants');
const { PREFIX } = require('../../config.js');

const { dark_red } = require("../../data/colors.json");
const { check_mark, cross_mark } = require('../../data/emojis.json');

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports.run = async (client, message, args) => {
    if(!args[0]) {
        return message.channel.send(`Pour afficher l'aide de la commande: \`${PREFIX}${MESSAGES.COMMANDS.CDS.SEARCHGROUP.name} help\``);
    }
    else if(args[0] == "help") { // HELP
        const embed = new MessageEmbed()
            .setColor(colors.night)
            .setDescription(`Permet de rechercher et de rejoindre (ou quitter) un groupe pour un jeu multijoueur`)
            .addField("Commandes", `- ${PREFIX}searchgroup search <game name> : cherche un groupe pour le jeu souhaité
                \n- ${PREFIX}searchgroup list : affiche la liste des groupes rejoint
                \n- ${PREFIX}searchgroup join <name group> : rejoindre le groupe
                \n- ${PREFIX}searchgroup leave <name group> : quitter le groupe
                \n- ${PREFIX}searchgroup create <name group> <nb max> <game name> : créé un groupe de nb max joueurs (2 à 15) pour le jeu mentionné
                \n- ${PREFIX}searchgroup disolve <name group> : dissout le groupe mentionné (capitaine du groupe uniquement)
                \n- ${PREFIX}searchgroup transfert <name group> <mention user> : transfert le statut capitaine du groupe à la personne mentionné`)
            .addField('Règles du nom de groupe', `- Ne peut contenir que des lettres [a ➔ z], des chiffres [0 ➔ 9] ou des caractères spéciaux : "-", "_", "&"
                - Le nom possède minimum 3 caractères et au maximum 15 caractères`);

        return message.channel.send({embeds: [embed]});
    }
    else if(args[0] == "list") { // LIST
        // afficher liste des groupes rejoints (+ préciser quand capitaine du groupe)
    }
    else if(args[0] == "join") { // JOIN
        //REJOINT LE GROUPE SI IL RESTE ENCORE UNE PLACE
    }
    else if(args[0] == "leave") { // LEAVE
        //QUITTE LE GROUPE
    }
    else if(args[0] == "create") { // Créer groupe
        try {            
            const captain = message.author;
            const nameGrp = args[1];
            const nbMaxMember = !!parseInt(args[2]) ? parseInt(args[2]) : null;
            // recup le reste des arguments : nom du jeu
            const gameName = args.slice(3).join(' ');
            // TODO description

            if (!nameGrp || !nbMaxMember || !gameName) 
                throw `> ${PREFIX}searchgroup create **<name group>** **<nb max>** **<game name>**\n*Créé un groupe de nb max joueurs (2 à 15) pour le jeu mentionné*`;
            
            // TODO test nom groupe [a-Z0-9] avec accent, caracteres speciaux (pas tous), min 3, max 15
            let reg = /([A-Za-zÀ-ÿ0-9]|[&$&+,:;=?|'"<>.*()%!_-]){3,15}/
            // la regex test la taille mais pour l'utilisateur il vaut mieux lui dire d'où vient le pb
            if (nameGrp.length < 3)
                throw `> Le nombre **minimum** de caractères pour le nom d'un groupe est de **3**`;
            if (nameGrp.length > NB_MAX.GROUP.CHARNAME)
                throw `> Le nombre **maximum** de caractères pour le nom d'un groupe est de **${NB_MAX.GROUP.CHARNAME}**`;
            if (!nameGrp.match(reg))
                throw `> Le nom du groupe ne convient pas. Vérifiez les caractères spéciaux et pas d'espaces !`;

            // nb max member entre 2 et 25
            if (nbMaxMember < 2)
                throw `> Le nombre **minimum** de joueurs dans un groupe est de **2**`;
            if (nbMaxMember > NB_MAX.GROUP.MEMBER)
                throw `> Le nombre **maximum** de joueurs dans un groupe est de **${NB_MAX.GROUP.MEMBER}**`;

            // si nom groupe existe
            // TODO a revoir ? le fait qu'il faut continuer dans le then..
            let grp = await client.findGroupByName(nameGrp);
            if (grp) 
                throw `> Le nom du groupe existe déjà. Veuillez en choisir un autre.`;

            // création de la regex sur le nom du jeu
            console.log(`\x1b[34m[INFO]\x1b[0m Recherche jeu Steam par nom : ${gameName}..`);
            let regGame = new RegExp(gameName, "i");

            let msgLoading = await message.channel.send(`Je suis en train de chercher le jeu..`);
            message.channel.sendTyping();
            let appList = await client.getAppList();
            msgLoading.delete();

            // TODO test status
            let apps = appList.body.response.apps;
            //let apps = appList.body.applist.apps;
            // filtre les jeux par le nom 
            //apps = apps.filter(app => app.name.match(regGame));
            // IStoreApps
            let games = apps.filter(app => app.name.match(regGame));
            // TODO filtre only MP game

            // on recupere que les jeux (type: game)
            // ISteamApps
            /* let games = [];
            for (const app of apps) {
                console.log('hey', app);
                let gameData = await client.getAppDetails(app.appid);

                console.log('-', gameData.body[app.appid]);
                if (gameData?.body[app.appid]?.data?.type && gameData?.body[app.appid]?.data?.type === 'game')
                    games.unshift(gameData.body[app.appid].data);
            } */

            console.log(`\x1b[34m[INFO]\x1b[0m .. ${games.length} jeu(x) trouvé(s)`);
            if (!games) throw 'Erreur lors de la recherche du jeu';
            if (games.length === 0) throw `Pas de résultat trouvé pour **${gameName}** !`;
            // MAX 5 row, MAX 5 btn par row = 25 boutons
            if (games.length > 25) throw `Trop de résultat trouvés pour **${gameName}** !`;

            let gameId;
            if (games.length === 1) {
                gameId = games[0].appid.toString();
            }
            else {
                let rows = [];
                for (let i = 0; i < games.length; i += 5) {
                    // creation action row
                    let row = new MessageActionRow();
                    for (let j = i; j < i + 5; j++) {
                        // creation message button
                        let crtGame = games[j];
                        if (crtGame) {
                            row.addComponents(
                                new MessageButton()
                                    //.setCustomId(crtGame.steam_appid.toString())
                                    .setCustomId(crtGame.appid.toString())
                                    .setLabel(crtGame.name)
                                    .setStyle('PRIMARY')
                            );
                        }
                    }
                    rows.unshift(row);
                }
                
                const embed = new MessageEmbed()
                    .setColor(colors.night)
                    .setTitle(`J'ai trouvé ${games.length} jeux !`)
                    .setDescription(`Lequel est celui que tu cherchais ?`);

                let msgEmbed = await message.channel.send({embeds: [embed], components: rows });
                
                // attend une interaction bouton de l'auteur de la commande
                const filter = i => {return i.user.id === message.author.id}
                let interaction = await msgEmbed.awaitMessageComponent({
                    filter,
                    componentType: 'BUTTON',
                    // time: 10000
                });

                console.log(`\x1b[34m[INFO]\x1b[0m .. Steam app id ${interaction.customId} choisi`);
                gameId = interaction.customId;
                msgEmbed.delete();
            }

            // creation groupe
            let user = await client.getUser(captain);
            let newGrp = {
                name: nameGrp,
                nbMax: nbMaxMember,
                captain: user._id,
                gameId: gameId
            };
            await client.createGroup(newGrp);

            const newMsgEmbed = new MessageEmbed()
                .setTitle(`${check_mark} Le groupe **${nameGrp}** a bien été créé !`)
                .addFields(
                    { name: 'ID Jeu', value: `${gameId}`, inline: true },
                    { name: 'Nb max joueurs', value: `${nbMaxMember}`, inline: true },
                    { name: 'Capitaine', value: `${captain}` },
                );
            message.channel.send({ embeds: [newMsgEmbed], components: [] });
        } catch (err) {
            const embedError = new MessageEmbed()
                .setColor(dark_red)
                .setTitle(`${cross_mark} Impossible de créer le groupe.`)
                .setDescription(`${err}`);
            console.log(`\x1b[31m[ERROR] \x1b[0mErreur searchgroup ${args[0]} : ${err}`);
            return message.channel.send({ embeds: [embedError] });
        };
    }
    else if(args[0] == "disolve") { // Dissout groupe
        //DISSOUT LE GROUPE SI IL EST CAPITAINE
    }
    else if(args[0] == "transfert") { // Transfert le statut capitaine à un autre membre du groupe
        //TRANSFERT LE STATUT CAPITAINE A UN AUTRE MEMBRE DU GROUPE (VERIFIER S'IL EST CAPITAINE)
    }
    else {
        return message.channel.send(`Commande non valide, référez-vous à la commande d'aide : \`${PREFIX}${MESSAGES.COMMANDS.CDS.SEARCHGROUP.name} help\``);
    }
}

module.exports.help = MESSAGES.COMMANDS.CDS.SEARCHGROUP;