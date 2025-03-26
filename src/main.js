require("dotenv").config();

const {Client, IntentsBitField, EmbedBuilder, ActivityType} = require("discord.js");

const helpEmbed = new EmbedBuilder()
    .setTitle("Squamble Command List")
    .addFields(
        { name: "getcreds", value: "getcreds [user]"},
        { name: "info", value: "How many CREDS does [user] have?"}
    )

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '../savedUsers.json');

async function loadUserData() {
    const fileData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileData);
}

async function saveUserData(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function getUserRank(UID) {
    const data = await loadUserData();

    if (!data[UID]) {
        data[UID] = {
            exp: 0,
            rank: "user"
        };
        await saveUserData(data);
        return 0;
    }

    return data[UID].rank;
}

async function getUserCreds(UID) {
    const data = await loadUserData();

    if (!data[UID]) {
        data[UID] = {
            exp: 0,
            rank: "user"
        };
        await saveUserData(data);
        return 0;
    }

    return data[UID].exp;
}

async function setUserRank(UID, rank) {
    const data = await loadUserData();

    // Always create user if missing
    if (!data[UID]) {
        data[UID] = {
            exp: 0,
            rank: rank
        };
    } else {
        data[UID].rank = rank;
    }

    await saveUserData(data);
}

async function setUserCreds(UID, exp) {
    const data = await loadUserData();

    // Always create user if missing
    if (!data[UID]) {
        data[UID] = {
            exp: exp,
            rank: "user"
        };
    } else {
        data[UID].exp = exp;
    }

    await saveUserData(data);
}

async function addUserCreds(UID, amount) {
    const data = await loadUserData();

    // Always create user if missing
    if (!data[UID]) {
        data[UID] = {
            exp: amount,
            rank: "user"
        };
    } else {
        data[UID].exp += amount;
    }

    await saveUserData(data);
}

client.on("ready", (c) => {
    console.log(`${c.user.displayName} is ready!`);
    client.user.setActivity("Just Squamblin' around", {type: ActivityType.Custom});
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "addcreds") {
        if (await getUserRank(interaction.user.id) === "admin" || await getUserRank(interaction.user.id) === "owner") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getNumber("amount");
            await addUserCreds(user.id, amount);
            console.log(user.id);
            interaction.reply(`Added ${amount} CREDS to ${user.tag}`);
        }
    }
    if (interaction.commandName === "setcreds") {
        if (await getUserRank(interaction.user.id) === "admin" || await getUserRank(interaction.user.id) === "owner") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getNumber("amount");
            await setUserCreds(user.id, amount);
            console.log(user.id);
            interaction.reply(`Set ${user.tag}s CREDS to ${amount}`);
        }
    }
    if (interaction.commandName === "getcreds") {
        const user = interaction.options.getUser("user");
        let userCreds = await getUserCreds(user.id);
        console.log(user.id);
        interaction.reply(`${user.tag} has ${userCreds} CREDS`);
    }
    if (interaction.commandName === "setrank") {
        if (await getUserRank(interaction.user.id) === "owner") {
            const user = interaction.options.getUser("user");
            const rank = interaction.options.getNumber("rank");
            await setUserRank(user.id, rank);
            console.log(user.id);
            interaction.reply(`Set ${user.tag}s RANK to ${rank}`);
        }
    }
    if (interaction.commandName === "bet") {
        if (Math.random() >= 0.75) {
            addUserCreds(interaction.user.id, interaction.options.getNumber("bet"));
            interaction.reply("You doubled your bet, NICE!");
        } else {
            addUserCreds(interaction.user.id, -interaction.options.getNumber("bet"));
            interaction.reply("You lost your bet (womp womp.)");
        }
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (await getUserRank(message.user.id) === "blacklist")
    await addUserCreds(message.author.id, 1);
});

client.login(process.env.TOKEN);