const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { allowedRole, targetChannelId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist_remove')
        .setDescription('Remove player from the whitelist')
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
            const targetChannel = await interaction.client.channels.fetch(targetChannelId);
            
            if (targetChannel) {
                await targetChannel.send(`whitelist remove ${playerName}`);
                
                const embed = new EmbedBuilder()
                    .setDescription(`:white_check_mark: **${playerName}** has been removed from the whitelist.`)
                    .setColor('#0099ff');
                await interaction.editReply({ embeds: [embed] });
             
            } else {
                console.error('Target channel not found.');
                await interaction.editReply('Failed to find the target channel.');
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to send the whitelist command.');
        }
    },
};