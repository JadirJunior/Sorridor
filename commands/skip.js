const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {useQueue} = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música.'),
    
    async execute({client, interaction}) {
        
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying()) 
            return interaction.reply(`Opa, parece que não estou em nenhum lugar, mas se quiser que seja dentro de você, ficarei grato, querido \n👉👌🔞🦃`);


        if (queue) {
            queue.node.skip();
        }

        await interaction.deferReply();

        return interaction.followUp({
            embeds: [
                new EmbedBuilder().setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL()
                }).setDescription(`**Nossa, meu querido, já quer ir pra próxima? Assim eu não aguen- 💦🔞🦃**)`)
            ]
        });
    }
}