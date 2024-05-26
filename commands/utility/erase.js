const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { allowedRole } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('erase')
        .setDescription('Purge a specified number of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to purge')
                .setRequired(true)
    ),
    async execute(interaction) {
        if (!allowedRole.some(role => interaction.member.roles.cache.has(role))) {
            return interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }
        const amount = interaction.options.getInteger('amount');

        // Check if the amount is within the limit
        if (amount < 1 || amount > 100) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('You need to input a number between 1 and 100.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Delete the messages
        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('There was an error trying to purge messages in this channel!');
            interaction.reply({ embeds: [embed], ephemeral: true });
        });

        // Confirm the deletion
        const embed = new EmbedBuilder()
            .setColor('#1dceff')
            .setDescription(`*<@${interaction.user.id}> purged ${amount} messages.*`);
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};