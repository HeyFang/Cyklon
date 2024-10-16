const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Sort names into groups of two from a given list')
        .addStringOption(option =>
            option.setName('teams')
                .setDescription('Comma-separated list of team names')
                .setRequired(true)),
    async execute(interaction) {
        // Get the input string from the command options
        const teamsInput = interaction.options.getString('teams');
        
        // Split the input string into an array of team names
        const teams = teamsInput.split(',').map(team => team.trim());

        // Check if there are at least 2 teams
        if (teams.length < 2) {
            return interaction.reply({ content: 'Please provide at least 2 teams.', ephemeral: true });
        }

        // Function to shuffle an array
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Shuffle the teams array
        const shuffledTeams = shuffle([...teams]); // Use a copy of the original array to preserve order

        // Group the shuffled teams into pairs
        const groupedTeams = [];
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            const group = shuffledTeams.slice(i, i + 2);
            groupedTeams.push(group.join(' **v/s** '));
        }

        // Create an embed message
        const embed = new EmbedBuilder()
            .setTitle('<:crownbs:809042950360137778> Omega Trio Tourny Matchups <:crownbs:809042950360137778>')
            .setColor('#0099ff')
            .addFields(
                { name: 'Participated Teams', value: teams.join(', ') },
                { name: 'ROUND 1', value: groupedTeams.join('\n\n') }
            );

        // Reply with the embed
        await interaction.reply({ embeds: [embed] });
    },
};