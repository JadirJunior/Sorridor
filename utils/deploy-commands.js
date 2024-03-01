const { REST, Routes } = require('discord.js');

const { token, clientId } = require('../config.json');

const fs = require('node:fs');
const path = require('node:path');

const commands = [];


const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    
    const command = require(filePath);
    console.log(command);

    if ('data' in command && 'execute' in command) {
        console.log(`Carregando o comando ${command.data.name}`);
        commands.push(command.data.toJSON());
    } else {
        console.log(`Ocorreu um erro ao carregar o comando no arquivo ${filePath}`);
    }
}

const rest = new REST().setToken(token);


const execute = async () => {
    try {
        console.log(`Atualizando ${commands.length} comandos de slash`);

        const data = await rest.put(
            Routes.applicationCommands(clientId), 
            { body: commands },
        );

        console.log(`${data.length} comandos de Slash recarregados com sucesso!`);

    } catch (error) {
        console.log(error);
    }
}

execute();