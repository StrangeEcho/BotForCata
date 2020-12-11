const { MessageEmbed } = require("discord.js");
const { ownerID, prefix } = require("../config");
const { clean } = require("../util");
const fs = require("fs");
const path = require("path");

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

module.exports.help = {
	aliases: ["h"],
	async execute(message, args) {

		if (!args.length) {
			return;
			// TODO: return generic help embed
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

module.exports.prefix = {
	ownerOnly: true,
	async execute(message, args) {
		const GuildConfig = require("../db/GuildConfig.json");
		if (!args.length) {
			return message.channel.send(new MessageEmbed({
				title: "Current prefix",
				description: GuildConfig[message.guild.id]?.prefix ?? prefix,
				color: message.member.displayColor,
			}));
		}
		const Guild = GuildConfig[message.guild.id];
		if (!Guild) {
			const input = {
				prefix: args[0],
			};
			GuildConfig[message.guild.id] = input;
		}
		fs.writeFile(path.join(__dirname, "..", "db", "GuildConfig.json"), JSON.stringify(GuildConfig, null, 4), "utf8", async (err) => {
			if (err) {
				return console.log(err);
			}
			return message.channel.send(new MessageEmbed({
				title: "Prefix changed",
				color: message.member.displayColor,
			}));
		});
	},
};
