require("dotenv").config();
const { REST, Routes, Options, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "addexp",
    description: "Adds EXP to a user. Adds them to the database if they dont exist yet.",
    options: [
      {
        name: "amount",
        description: "How much EXP to add.",
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: "user",
        description: "Who do you want to give the EXP.",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
  {
    name: "setexp",
    description: "Sets a users EXP to a specific value. Adds them to the database if they dont exist yet.",
    options: [
      {
        name: "amount",
        description: "What do you want to set the EXP to.",
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: "user",
        description: "Who's EXP do you want to change.",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
  {
    name: "getexp",
    description: "Gives you the EXP of a specific person.",
    options: [
      {
        name: "user",
        description: "Who's EXP do you want.",
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  },
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
