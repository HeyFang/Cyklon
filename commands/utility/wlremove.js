const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const { allowedRole } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_remove')
        .setDescription('Remove a player from the whitelist')
        .addStringOption(option =>
            option.setName('player')
                .setDescription('The name of the player to remove')
                .setRequired(true)),
    async execute(interaction) {

        if (!allowedRole.some(role => interaction.member.roles.cache.has(role))) {
            return interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }
        // Respond immediately with a "Processing..." message
        await interaction.deferReply();

        const playerName = interaction.options.getString('player');

        try {
            // Read the whitelist.json file
            const data = await fs.readFile('../minecraft/whitelist.json', 'utf8');

            // Parse the JSON data
            const whitelist = JSON.parse(data);
            

            // Find and remove the player from the whitelist
            const index = whitelist.findIndex(player => player.name === playerName);
            if (index !== -1) {
                whitelist.splice(index, 1);

                // Write the updated whitelist back to the file
                await fs.writeFile('../minecraft/whitelist.json', JSON.stringify(whitelist, null, 2));

                const embed = new EmbedBuilder()
                    .setDescription(`:white_check_mark: ${playerName} has been removed from the whitelist.`)
                    .setColor('#0099ff');

                await interaction.editReply({ embeds: [embed] });
            } else {
                // Player not found
                await interaction.editReply(`Player ${playerName} is not in the whitelist.`);
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to update whitelist.');
        }
    },
};