require("dotenv").config();

const {Client, IntentsBitField} = require("discord.js");

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

async function getUserExp(UID) {
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

async function setUserExp(UID, exp) {
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

async function addUserExp(UID, amount) {
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
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "yap") {
        interaction.reply(interaction.options.get("value").value);
    }

    if (interaction.commandName === "addexp") {
        if (await getUserRank(interaction.user.id) === "admin") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getNumber("amount");
            await addUserExp(user.id, amount);
            console.log(user.id);
            interaction.reply(`Added ${amount} EXP to ${user.tag}`);
        }
    }
    
});


client.login(process.env.TOKEN);