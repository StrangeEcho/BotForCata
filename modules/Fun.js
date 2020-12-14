const Discord = require("discord.js");
const func = (member) => [`Yes, ${member} is quite smart.`, `No, ${member} is super duper dumb.`];
const { getUserFromMention } = require("../util");
module.exports.eightball = {
	aliases: ["8ball"],
	args: true,
	description: "Ask the 8ball a yes/no question.",
	example: ["are you a good bot?"],
	usage: "<question>",
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

module.exports.smart = {
	description: "Mention someone to check if they are smart.",
	example: ["@Drev"],
	usage: "<mention>",
	args: true,
	async execute(message, args) {
		const user = getUserFromMention(args[0], message);

		if (user) {
			const answers = func(user);
			const answer = answers[Math.floor((Math.random() * answers.length))];

			return message.reply(answer);
		}
		return message.reply("Please mention someone.");
	},
};