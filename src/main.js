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

async function getImage(query) {
    const accessKey = process.env.UNSPLASHKEY;
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${accessKey}`);
    const data = await res.json();
  
    if (data.results.length > 0) {
        const randomImage = data.results[Math.floor(Math.random() * data.results.length)];
        return randomImage.urls.regular;
    }

    return "No images found 😢";
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