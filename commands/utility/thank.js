const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('thank')
		.setDescription('Thank a user with watermelon')
		.addUserOption(option => option
            .setName('user')
            .setDescription('specify user')
            .setRequired(false)),
			async execute(interaction) {
				const user = interaction.options.getUser('user');
				if (user) {
					await interaction.reply(`thenk you *:)* \nheres a wotamelo for ya :watermelon:, <@${user.id}>!`);
				} else {
					await interaction.reply('puck off...');
				}
			},
};