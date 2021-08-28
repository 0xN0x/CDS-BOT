const mongoose = require("mongoose");
const { User, Group } = require("../models/index");

module.exports = client => {
    /* User */
    client.createUser = async user => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, user);
        const createUser = await new User(merged);
        createUser.save().then(u => console.log(`\x1b[34m[INFO]\x1b[35m[DB]\x1b[0m Nouvel utilisateur : ${u.username}`));
    };

    client.getUser = async user => {
        return client.findUserById(user.id);
    };

    client.findUserById = async id => {
        const data = await User.findOne({userId: id});
        if (data) return data;
        else return;
    };

    client.updateUser = async (user, settings) => {
        let data = await client.getUser(user);
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if(data[key] !== settings[key]) data[key] = settings[key];
        }
        return data.updateOne(settings);
    };

    /* Guild ? Créer d'autres fichiers de fonctions ? */

    /* Group */
    client.createGroup = async group => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, group);
        const createGroup = await new Group(merged);
        createGroup.save().then(grp => console.log(`\x1b[34m[INFO]\x1b[35m[DB]\x1b[0m Nouveau groupe : ${grp.name}`));
    };

    client.findGroupById = async id => {
        // TODO
    };

    client.findGroupByName = async name => {
        const data = await Group.findOne({name: name});
        if (data) return data;
        else return;
    };

}