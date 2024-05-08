const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
//const mineflayer = require('mineflayer');
const util = require('minecraft-server-util');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
// mineflayer stats
// const bot = mineflayer.createBot({
// 	host: '34.131.215.0', // Replace with your server's IP address or domain name
// 	port: 25565, // Replace with your server's port if it's not the default Minecraft port
// 	username: 'melonyFeng', // Replace with your bot's username
// 	password: 'melonyFeng', // Replace with your bot's password if the server requires authentication
//   });
  
//   bot.on('chat', (username, message) => {
//     console.log(`${username}: ${message}`);

//     console.log('Active players:');
//     for (const playerName in bot.players) {
//        console.log(playerName);
//     }
// });




// setInterval(() => {
//     bot.chat('Keeping connection alive');
// }, 60000);

client.login(token);