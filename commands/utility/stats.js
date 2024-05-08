// commands/status.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('minecraft-server-util');
const { EmbedBuilder } = require('discord.js');
const { serverIp } = require('../../config.json');
const { getStatus } = require("./getStatus.js");
const port = 25565;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get the status of the Minecraft server'),
        async execute(interaction) {
            let serverStatus;
            let playerCount;
            let playerNames = 'No players online';
            
            const data = await getStatus(4, serverIp, port);
        
            try {
                const response = await util.status(serverIp);
                serverStatus = 'Online';
                playerCount = response.players.online;
                if (response.players.sample) {
                    playerNames = response.players.sample.map(player => player.name).join('\n');
                }
            } catch (error) {
                serverStatus = 'Offline';
                playerCount = 'N/A';
                playerNames = 'N/A';
            }
        
            const embed = new EmbedBuilder()
                .setTitle(':cyclone: CyklonSMP Server Status')
                .setDescription("Server is currently: `" + `${serverStatus}` + "`")
                .setColor('#0099ff')
                .addFields(
                    { 
                        name: `Players online: ${playerCount}`, 
                        value: "`" + `${playerNames}` + "`", 
                        inline: true 
                    });
        
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
               
                // Schedule this command to re-run every 30 seconds (30000 milliseconds)
setInterval(async () => {
    try {
        const newResponse = await util.status(serverIp);
        const newPlayerCount = newResponse.players.online;
        let newPlayerNames = 'No players online';

        if (newResponse.players.sample) {
            newPlayerNames = newResponse.players.sample.map(player => player.name).join('\n');
        }

        const newEmbed = new EmbedBuilder()
            .setTitle('CyklonSMP Server Status')
            .setDescription("Server is currently: `" + `${serverStatus}` + "`")
            .setColor('#0099ff')
            .addFields(
                { 
                    name: `Players online: ${newPlayerCount}`, 
                    value: "`" + `${newPlayerNames}` + "`", 
                    inline: true 
                }
            );

        // Edit the message
        await message.edit({ embeds: [newEmbed] });
    } catch (error) {
        console.error(error);
    }
}, 30000);
            
        },
};