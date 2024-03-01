const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Devolve o pong!'),
    
    async execute({ interaction }) {
        await interaction.reply(`Olá, ${interaction.user.username}, macaco pong! (Você entrou em ${interaction.member.joinedAt})`);
    }
}