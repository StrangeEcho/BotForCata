const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config");
const PrefixSupplier = require("../PrefixSupplier");

module.exports.ping = {
	description: "Pong",
	async execute(message) {
		const first = await message.channel.send("PINGIIIIIIIIIIIIIIIIIIIIIIIIIIIING");
		return first.edit(`Ping took: ${Date.now() - first.createdTimestamp}ms`);
	},
};


module.exports.commands = {
	aliases: ["cmds"],
	async execute(message) {

		const handler = message.client.Handler;

		const mapped = handler.categories.map((exported, category) => {
			const cmds = Object.entries(exported).map((cmd) => cmd[0] + (cmd[1]?.aliases ? ", " + cmd[1]?.aliases?.join(", ") : ""));
			return `**${category}**\n\`${cmds.join("` `")}\``;
		});
		return message.channel.send(new MessageEmbed({
			title: "Commands",
			description: mapped.join("\n"),
			color: message.member.displayColor,
		}));
	},
};

module.exports.help = {
	aliases: ["h"],
	async execute(message, args) {

		if (!args.length) {
			const currentPrefix = PrefixSupplier(message);
			return message.channel.send(new MessageEmbed({
				title: `${message.client.user.tag} help page`,
				color: message.member.displayColor,
				fields: [
					{ name: "Commands", value: `\`${currentPrefix}commands\` returns a list of all my commands.` },
					{ name: "Help", value: `\`${currentPrefix}help [command]\` returns information of the specified command.
					Example: \`${currentPrefix}help ping\`` },
				],
			}));
		}

		const commands = message.client.commands;
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.channel.send(`${message.author.tag}, that's not a valid command!`);
		}

		const data = [];

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		return message.channel.send(new MessageEmbed({
			title: name,
			description: data.join("\n"),
			color: message.member.displayColor,
		}));
	},
};

// Template
// module.exports.new = {
//  ownerOnly: false,
//  description: "",
//  usage: "",
//  args: false,
// 	aliases: ["cmds"],
// 	async execute(message) {
//
// 	},
// };