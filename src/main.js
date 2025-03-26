require("dotenv").config();

const {Client, IntentsBitField, EmbedBuilder, ActivityType, ReactionType} = require("discord.js");

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
        } else {
            interaction.reply("You do not have permission to run this command")
        }
    }
    if (interaction.commandName === "setcreds") {
        if (await getUserRank(interaction.user.id) === "admin" || await getUserRank(interaction.user.id) === "owner") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getNumber("amount");
            await setUserCreds(user.id, amount);
            console.log(user.id);
            interaction.reply(`Set ${user.tag}s CREDS to ${amount}`);
        } else {
            interaction.reply("You do not have permission to run this command")
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
            const rank = interaction.options.getString("rank");
            await setUserRank(user.id, rank);
            console.log(user.id);
            interaction.reply(`Set ${user.tag}s RANK to ${rank}`);
        } else {
            interaction.reply("You do not have permission to run this command")
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
    if (interaction.commandName === "steal") {
        if (await getUserCreds(interaction.user.id) >= 10) {
            if (await getUserCreds(await interaction.options.getUser("who").id) >= 15) {
                if (Math.random() >= 0.25) {
                    addUserCreds(interaction.user.id, 5);
                    addUserCreds(await interaction.options.getUser("who").id, -15);
                    interaction.reply(`You took 15 CREDS from ${await interaction.options.getUser("who")}`)
                } else {
                    interaction.reply("You got caught! Your bail was 30 CREDS.")
                    addUserCreds(interaction.user.id, -40)
                }
            } else {
                interaction.reply("They didnt have enough CREDS, you lost your preparation costs.");
                addUserCreds(interaction.user.id, -10)
            }
        } else {
            interaction.reply("You dont have enough CREDS to prepare.");
        }
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) {return;}
    if (await getUserRank(message.author.id) === "blacklist") {return;}
    await addUserCreds(message.author.id, 1);
});

client.login(process.env.TOKEN);