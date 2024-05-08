const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('secret pings!'),
	async execute(interaction) {
		await interaction.reply({content:"hey" + interaction.user.username + "!", ephemeral: true});
	},
};