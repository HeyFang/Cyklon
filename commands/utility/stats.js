// commands/status.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('minecraft-server-util');
const { EmbedBuilder } = require('discord.js');
const { serverIp } = require('../../config.json');
const { getStatus } = require("./getStatus.js");
const port = 25565;
const allowedUsers = ['927861412070584391', '643651318522839050', 'user3_id'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get the status of the Minecraft server'),
        async execute(interaction) {
            if (!allowedUsers.includes(interaction.user.id)) {
                return interaction.reply('You are not allowed to use this command.');
            }
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
                .setURL('https://discord.gg/PxsSPYK6hy')
                .setDescription("Server is currently: `" + `${serverStatus}` + "`")
                .setAuthor({ name: 'Cyclones Gaming Community', iconURL: 'https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/1024px/1f300.png', url: 'https://github.com/Fangify' })
                .setThumbnail('https://yt3.googleusercontent.com/ytc/AIdro_liw7VcUK8TEHJPuzYFHhpyMIpMh9pxXUJ9IsFfVLoY2m0=s900-c-k-c0x00ffffff-no-rj')
                .setColor('#1dceff')
                .addFields(
                    {name: 'IP', value: "`" + serverIp + "`", inline: true},
                    {name: '\u200B', value: '\u200B', inline: true},
                    {name: 'Version' , value: "`" + `${data.version.name}` + "`", inline: true},
                    {name: `Players online: ${playerCount}`,  value: "`" + `${playerNames}` + "`", inline: false}
                )
                .setTimestamp()
	            .setFooter({ text: 'Fangify', iconURL: 'https://avatars.githubusercontent.com/u/165249171?s=200&v=4.png' });
        
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
            .setTitle(':cyclone: CyklonSMP Server Status')
            .setURL('https://discord.gg/PxsSPYK6hy')
            .setDescription("Server is currently: `" + `${serverStatus}` + "`")
            .setAuthor({ name: 'Cyclones Gaming Community', iconURL: 'https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/1024px/1f300.png', url: 'https://github.com/Fangify' })
            .setThumbnail('https://yt3.googleusercontent.com/ytc/AIdro_liw7VcUK8TEHJPuzYFHhpyMIpMh9pxXUJ9IsFfVLoY2m0=s900-c-k-c0x00ffffff-no-rj')
            .setColor('#1dceff')
            .addFields(
                {name: 'IP', value: "`" + serverIp + "`", inline: true},
                {name: '\u200B', value: '\u200B', inline: true},
                {name: 'Version' , value: "`" + `${data.version.name}` + "`", inline: true},
                {name: `Players online: ${newPlayerCount}`, value: "`" + `${newPlayerNames}` + "`"}
            )
            .setTimestamp()
	            .setFooter({ text: 'Fangify', iconURL: 'https://avatars.githubusercontent.com/u/165249171?s=200&v=4.png' });

        // Edit the message
        await message.edit({ embeds: [newEmbed] });
    } catch (error) {
        console.error(error);
    }
}, 10000);
            
        },
};