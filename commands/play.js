const { SlashCommandBuilder, EmbedBuilder, Interaction, Client } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Usado para tocar uma música!')
        .addStringOption(option => {
            return option.setName('busca').setDescription('Buscar uma música!').setRequired(true)
        }),


    /**
     * 
     * @param {Client} client 
     *  
     */
    async execute({ client, interaction }) {
        if (!interaction.member.voice.channel) {

            await interaction.reply('Você deve estar conectado em um canal para solicitar músicas!');
            return;

        }

        await interaction.deferReply();

        const query = interaction.options.getString('busca');

        if (!query || query == '') {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder().setDescription(`**Onde que está a música, meu querido?**`)
                ]
            })
        }

        const result = await client.player.search(query);

        try {

            const { track } = await client.player.play(interaction.member.voice.channel, result, {
                nodeOptions: {
                    metadata: interaction.channel
                }
            });


            console.log(track);

            const queue = useQueue(interaction.guild.id);

            if (!queue) {
                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder().setDescription(`**Ocorreu um erro ao inserir a música na fila!**`)
                    ]
                })
            }



            if (queue.currentTrack === track) {

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder().setDescription(`**Nossa, que delícia, Cada segundo com você é um orgasmo diferente 💦🤤🦃** 
                            \n${track.title} (${track.url})`).setThumbnail(track.thumbnail)
                    ]
                })
            }

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder().setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()
                    }).setDescription(`**Música ${track.title}, uau... ela seria ótima pra usar no sexo, não acha? 🙊💦🦃** \n${track.url}`)
                    .setThumbnail(track.thumbnail)
                ]
            });

        } catch (error) {

            console.log(error);
        }


    }
}