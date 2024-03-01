const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder, ActivityType } =  require('discord.js');
const { Player } = require('discord-player');

const fs = require('node:fs');
const path = require('node:path');

const { token } = require('./config.json');

const client =  new Client( { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] } );

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`Ocorreu um erro ao carregar o comando no arquivo ${filePath}`);
    }
}


client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        hightWaterMark: 1 << 25
    }
});


client.player.events.on('playerStart', (queue, track) => {

    if (queue.repeatMode !== 1) {
        
        queue.metadata.send({
            embeds: [
                new EmbedBuilder().setDescription(`**Nossa, que delícia, Cada segundo com você é um orgasmo diferente 💦🤤🦃** 
                    \n${track.title} (${track.url})`).setThumbnail(track.thumbnail)
        ]});

    }

    console.log(`Começou a tocar uma música nova! ${track.title} ${queue.repeatMode}`)
})

//var cont = 0;

client.once(Events.ClientReady, async (c) => {
    console.log(`Bot ligado, macaco!`);
    await client.player.extractors.loadDefault();

    /*setInterval(() => {
        if (cont == 0) {
            client.user.setActivity('♪ Nunca viu um sorriso assim! ♪ ', { type: ActivityType.Listening });
        } 
        
        else if (cont == 1) {
            client.user.setActivity('♪ Aqui é Avernus... ♪ ', { type: ActivityType.Listening });
        } 
        
        else if (cont == 2) {
            client.user.setActivity('😏 Uau, Hakam... 🦃 ', { type: ActivityType.Watching });
        } else {
            cont = 0;
        }
        cont++;
    }, 200000);*/

});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.log(`Comando não encontrado! (${interaction.commandName})`);
        return;
    }

    try {
        await command.execute({client, interaction});
    } catch (error) {
        console.log(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});


client.login(token);