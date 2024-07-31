const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const pluginsDir = path.join(__dirname, '../../../mc/plugins');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plugins')
        .setDescription('List all plugins on the server'),
        async execute(interaction) {
            fs.readdir(pluginsDir, (err, files) => {
                if (err) {
                    console.error(err);
                    const embed = new EmbedBuilder()
                        .setColor('#1dceff')
                        .setDescription('*An error occurred while reading the plugins directory*')
                        .setTimestamp()
                        .setFooter({ text: "Cyklons Gaming Community", iconURL: 'https://raw.githubusercontent.com/HeyFang/echoFang/main/image.png' });
                    return interaction.reply({ embeds: [embed] });
                }
        
                const plugins = files
                    .filter(file => file.endsWith('.jar'))
                    .map(file => file.replace('.jar', ''));
        
                const embed = new EmbedBuilder()
                    .setColor('#1dceff')
                    .setTitle('Active Plugins')
                    .setDescription(plugins.length > 0 ? "`" + plugins.join('\n') + "`" : 'No active plugins found.')
                    .setTimestamp()
                    .setFooter({ text: "Cyklons", iconURL: 'https://raw.githubusercontent.com/HeyFang/echoFang/main/image.png' });
        
                return interaction.reply({ embeds: [embed] });
            });
        }
    }