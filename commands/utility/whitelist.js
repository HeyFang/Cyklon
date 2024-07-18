const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Check the names of currently whitelisted players'),
    async execute(interaction) {
        // Respond immediately with a "Processing..." message
        await interaction.deferReply();

        try {
            
            const data = await fs.readFile('../minecraft/whitelist.json', 'utf8');
            const whitelist = JSON.parse(data);
            const names = whitelist.map(player => player.name);

            const embed = new EmbedBuilder()
                .setTitle('Whitelisted Players')
                .setDescription(names.join('\n'))
                .setColor('#0099ff');

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to retrieve whitelist.');
        }
    },
};