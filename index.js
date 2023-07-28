const fetch = require('node-fetch-commonjs');
const fs = require('fs');

const discord = require('discord.js');
const client = new discord.Client({intents: [ discord.GatewayIntentBits.MessageContent, discord.GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.Guilds ]});
const shorteners = fs.readdirSync('./_hosts/').map(e => e = e.slice(0, -3));

const urlRegex = /(https?:\/\/[^\s]+)/g;

client.on('ready', () => console.log('ready'));

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    //console.log(message.content);
    
    var urls = message.content.match(urlRegex) || [];
    if(urls.length == 0) return;

    urls.forEach(async url => {
        const rizz = await fetch(url);
        const urlified = new URL(rizz.url);
        
        if(shorteners.includes(urlified.hostname.toLowerCase()))
        {
            let unlinker = require(`./_hosts/${urlified.hostname.toLowerCase()}.js`);
            const msg = await message.reply({content: `Getting url from ${urlified.hostname}...`, allowedMentions: {"replied_user": false}});
            msg.edit({content: `**Redirection detected:**\n<${url}> --> <${await unlinker.main(rizz.url, urlified.hostname.toLowerCase())}>`, allowedMentions: {"replied_user": false}});
        }
        else if(rizz.url.toLowerCase() != url.toLowerCase()) message.reply({content: `**Redirection detected:**\n<${url}> --> <${rizz.url}>`, allowedMentions: {"replied_user": false}})
    });
});

client.login('ur bot discord token');