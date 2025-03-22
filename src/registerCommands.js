require("dotenv").config();
const { REST, Routes, Options, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "yap",
    description: "Returns the passed value",
    options: [
        {
            name: "value",
            description: "The value passed through",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("slash commands setting up");
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOTID, process.env.GUILDID), { body: commands });
    for (let i = 0; i < commands.length; i++) {
        console.log(commands[i].name);
        console.log(commands[i].description);
        console.log(commands[i].options)
    }
    console.log("slash commands worky worky");
  } catch (err) {
    console.error(`There was an error (get destroyed lol): ${err}`);
  }
})();
