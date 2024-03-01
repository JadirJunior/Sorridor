const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {useQueue} = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para o bot de música'),
    
    async execute({client, interaction}) {
        const queue = useQueue(interaction.guild.id);

        await interaction.deferReply();

        if (queue) {
            queue.delete();

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder().setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    }).setDescription(`**Te espero para a próxima noite... 😋🦃😏**)`)
                ]
            });
        } else {
            return interaction.reply(`Opa, parece que não estou em nenhum lugar, mas se quiser que seja dentro de você, ficarei grato, querido \n👉👌🔞🦃`);

        }
    }
}