import {REST, Routes} from "discord.js";

const commands = [
    {
        name: "silly",
        description: "Get a little silly."
    }
];

const rest = new REST({version: "10"}).setToken("MTM1MzAyMDkxODcxNjE3MDMyMg.G5aAu0.Snf_W6NcriMA_PxXvdno9098FTQrFHHqwqiTKk");

try {
    console.log("Started slash command initialization");
    await rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands});
    console.log("Slash commands initialized");
} catch(error) {
    console.log(error);
}