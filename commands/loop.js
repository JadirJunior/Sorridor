const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const modelo = [
    'Loop desligado', //0
    'Loop da música', //1
    'Loop da Fila' //2
]





module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Ativar repetição de música')
        .addStringOption(option => {
            return option.setName('modo')
                .setDescription('Escolha o modo de repetição -> One: Música; Off: Desligado; On: Fila')
                .addChoices({ name: 'one', value: 'one' }, { name: 'off', value: 'off' }, { name: 'on', value: 'on' }).setRequired(true)
        }),

    async execute({ client, interaction }) {

        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply(`Opa, parece que não estou em nenhum lugar, mas se quiser que seja dentro de você, ficarei grato, querido \n👉👌🔞🦃`);


        const param = interaction.options.getString('modo');
        console.log("Modo: " + param);

        await interaction.deferReply();

        var mode; //= Number(param.toLowerCase().trim()) || -1;

        if (param.toLowerCase().trim() == "on") {
            //Fila
            mode = 2;
        } else {
            if (param.toLowerCase().trim() === 'one') {
                //Música
                mode = 1;
            } else if (param.toLowerCase().trim() === 'off') {
                //Desligado
                mode = 0;
            } else {
                mode = -1;
            }
        }

        if (queue) {

            if (mode == -1) {

                return interaction.followUp({
                    embeds: [
                        new EmbedBuilder().setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()
                        }).setDescription(`**Opa meu querido, botou no buraco errado...🙊🦃🔞 \nSó pode colocar no "one" ou "off"...**`)
                    ]
                });
            }

            queue.setRepeatMode(mode);
        }

        return interaction.followUp({
            embeds: [
                new EmbedBuilder().setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL()
                }).setDescription(`**Agora você não sai de dentro de mim... 🙊🦃🔞 \nAlternando o modo para**\n${modelo[mode]}`)
            ]
        });
    }
}