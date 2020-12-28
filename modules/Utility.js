const { MessageEmbed, Permissions } = require("discord.js");
const Command = require("../Command");
const { prefix } = require("../config");
const PrefixSupplier = require("../PrefixSupplier");
const emoteRegex = /<(a?)((!?\d+)|(:.+?:\d+))>/g;

module.exports.ping = new Command({
	aliases: ["p"],
	description: "Shows bot latency",
	clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
	prefix: ",,",
	async execute(message) {
		const first = await message.channel.send("PINGIIIIIIIIIIIIIIIIIIIIIIIIIIIING");
		return first.edit(`Ping took: ${Date.now() - first.createdTimestamp}ms`);
	},
});

module.exports.commands = new Command({
	aliases: ["cmds"],
	async execute(message) {

		const { categories } = message.client.commandHandler;
		const mapped = categories.map((exported, category) => {
			const cmds = Object.entries(exported).map((cmd) => cmd[1]?.aliases.join(", "));
			return `**${category}**\n\`${cmds.join("` `")}\``;
		});

		return message.channel.send(new MessageEmbed({
			title: "Commands",
			description: mapped.join("\n"),
			color: message.member.displayColor,
		}));
	},
});

module.exports.help = new Command({
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

		const { commands } = message.client.commandHandler;
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
});

module.exports.showemoji = new Command({
	aliases: ["emoji", "se"],
	prefix: "//",
	args: true,
	description: "Shows information and image link for an emoji.",
	ownerOnly: false,
	usage: "<emoji>",
	async execute(message, args) {

		let emoji = undefined;
		const match = args[0].match(emoteRegex)[0];

		if (!match) {
			return message.channel.send("Please provide an emoji/emote.");
		}

		else if (match.startsWith("<") && match.endsWith(">")) {

			const emoteID = match.match(/\d+/g);

			emoji = `https://cdn.discordapp.com/emojis/${emoteID.toString()}.${match.indexOf("a") === 1 ? "gif" : "png"}`;

			const name = match.slice(2, match.lastIndexOf(":")).replace(":", "");

			return message.channel.send(new MessageEmbed({
				description: `**Name:** ${name}
				**Link:** ${emoji}`,
				image: { url: emoji },
				color: message.member.displayColor,
			}));
		}
	},
});

// New Template
// module.exports.pp = new Command({
// 	aliases: ["alias1", "alias2"],
// 	args: false,
// 	clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
// 	description: "pp command",
// 	ownerOnly: false,
// 	usage: "<arg here if args>",
// 	userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
// 	async execute(message) {
// 		const first = await message.channel.send("PINGIIIIIIIIIIIIIIIIIIIIIIIIIIIING");
// 		return first.edit(`Ping took: ${Date.now() - first.createdTimestamp}ms`);
// 	},
// });
