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

async function getUserExp(UID) {
    const data = await loadUserData();

    if (!data[UID]) {
        data[UID] = {
            exp: 0,
            otherinfo: "new user"
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
            otherinfo: "new user"
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
            otherinfo: "new user"
        };
    } else {
        data[UID].exp += amount;
    }

    await saveUserData(data);
}


async function getImage(query) {
   // const accessKey = process.env.UNSPLASHKEY;
   // const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${accessKey}`);
   // const data = await res.json();
   //
   // if (data.results.length > 0) {
   //     const randomImage = data.results[Math.floor(Math.random() * data.results.length)];
   //     return randomImage.urls.regular;
   // }

    return "command is not supported anymore lol";
}

client.on("ready", (c) => {
    console.log(`${c.user.displayName} is ready!`);
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "yap") {
        interaction.reply(interaction.options.get("value").value);
    }

    if (interaction.commandName === "pet") {
        const imageUrl = await getImage("furry");
        interaction.reply(imageUrl);
    }
});


client.login(process.env.TOKEN);