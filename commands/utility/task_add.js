const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('task_add')
    .setDescription('Create a task')
    .addStringOption(option => option
        .setName('name')
        .setDescription('specify task')
        .setRequired(true)),
	async execute(interaction) {
		const task = interaction.options.getString('name');
        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Finish Task')
			.setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder()
			.addComponents(confirm);
            const message = await interaction.reply({
            content: `[   ] - ${task}`,
			components: [row],
            fetchReply: true,
        });
        const filter = i => i.customId === 'confirm';

        message.awaitMessageComponent({ filter: filter })
            .then(async (buttonInteraction) => {
                await buttonInteraction.update({ content: `[:white_check_mark:] - ~~${task}~~`, components: [] });
            })
            .catch((e) => {
                // Handle the error here if needed
            });
        
	},
};