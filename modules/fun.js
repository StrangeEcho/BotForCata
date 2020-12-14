const Discord = require("discord.js");

module.exports.eightball = {
	aliases: ["8ball"],
	args: true,
	async execute(message, args) {

		if (!args[1]) return message.reply("Ask a full question.");

		const replies = ["Yes", "No", "I dont know", "Ask again later"];

		const result = replies[Math.floor((Math.random() * replies.length))];
		const question = args.join(" ");

		return message.channel.send(new Discord.MessageEmbed()
			.setAuthor(message.author.tag)
			.setColor("#FF9900")
			.addField("Question", question)
			.addField("Answer", result),
		);
	},
};