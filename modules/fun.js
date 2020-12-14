const Discord = require('discord.js');

modules.export.run = async (bot, message, args) => {    

    if(!args[2]) return message.reply("Ask a full question.");
    let replies = ["Yes", "No", "I dont know", "Ask again later"];

    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(1).join(" ");

    let ballembed = new Discord.RichEmbed()
    .setAuthor(message.author.tag)
    .setColor("#FF9900")
    .addField("Question", question)
    .addField("Answer" replies[result]);

    message.send(ballembed);

}

modules.export.help = {
    name: "8ball"
}