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

client.on("ready", (c) => {
    console.log(`${c.user.displayName} is ready!`);
})

client.on("interactionCreate", (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "yap") {
        interaction.reply(interaction.options.get("value").value);
    }
})

client.login(process.env.TOKEN);