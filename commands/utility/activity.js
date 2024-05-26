const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { allowedRole } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setactivity')
        .setDescription('Set the bot\'s activity and status')
        .addStringOption(option =>
            option.setName('activity')
                .setDescription('The activity to set')
                .setRequired(true)
    ),
    async execute(interaction) {
        // Check if the member has the allowed role
        if (!allowedRole.some(role => interaction.member.roles.cache.has(role))) {
            return interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }
    
        const activity = interaction.options.getString('activity');
    
        // Set the bot's activity
        await interaction.client.user.setActivity({ name: activity, type: ActivityType.Watching });
    
        // Reply with an embed
        const embed = new EmbedBuilder()
            .setColor('#1dceff')
            .setDescription(`*<@${interaction.user.id}> changed bot's activity to ${activity}.*`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};