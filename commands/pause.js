const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {useQueue} = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pula para a próxima música.'),
    
    async execute({client, interaction}) {
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying()) 
            return interaction.reply(`Opa, parece que não estou em nenhum lugar, mas se quiser que seja dentro de você, ficarei grato, querido \n👉👌🔞🦃`);

        await interaction.deferReply();

        if (queue) {
            queue.node.setPaused(!queue.node.isPaused());
        }

        return interaction.followUp({
            embeds: [
                new EmbedBuilder().setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL()
                }).setDescription(`**Pausando a música...**`)
            ]
        });

    }
}