const { MessageEmbed } = require("discord.js");
const { ownerID } = require("../config");
const { clean } = require("../util");

module.exports.ping = {
	description: "Pong",
	async execute(message) {
		const first = await message.channel.send("PINGIIIIIIIIIIIIIIIIIIIIIIIIIIIING");
		return first.edit(`Ping took: ${Date.now() - first.createdTimestamp}ms`);
	},
};

module.exports.eval = {
	description: "eval",
	args: true,
	usage: "<expression>",
	ownerOnly: true,
	async execute(message, args) {

		if (!ownerID.includes(message.author.id)) return;

		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") {evaled = require("util").inspect(evaled);}

			message.channel.send(clean(evaled), { code:"xl" });
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
};

module.exports.commands = {
	aliases: ["cmds"],
	async execute(message) {
		return message.channel.send(new MessageEmbed({
			title: "Commands",
			description: message.client.commands.map((cmd, cmdname) => `\`${cmdname}\`` + (cmd.aliases ? `, \`${cmd.aliases.join("', '")}\`` : "")).join("\n"),
			color: message.member.displayColor,
		}));
	},
};
