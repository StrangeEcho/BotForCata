const fs = require("fs");
const path = require("path");
const { MessageEmbed, Permissions } = require("discord.js");
const config = require("../config");
const Command = require("../Command");

module.exports.say = new Command({
	description: "Repeats message.",
	args: true,
	userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
	execute(message, args) {
		const sayMessage = args.join(" ");
		message.delete().catch(err => console.log(err));
		message.channel.send(sayMessage);
	},
});

module.exports.prefix = new Command({
	prefix: config.prefix,
	ownerOnly: true,
	async execute(message, args) {
		const GuildConfig = require("../db/GuildConfig.json");
		if (!args.length) {
			return message.channel.send(new MessageEmbed({
				title: "Current prefix",
				description: GuildConfig[message.guild.id]?.prefix ?? config.prefix,
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
});

module.exports.kick = new Command({
	args: true,
	clientPermissions: [Permissions.FLAGS.KICK_MEMBERS],
	description: "Kicks a member.",
	usage: "<member> <reason>",
	userPermissions: [Permissions.FLAGS.KICK_MEMBERS],
	async execute(message, args) {
		const user = message.mentions.users.first();
		const reason = args[1] ?? "Kicked.";
		if (user) {
			const member = message.guild.member(user);
			if (member) {
				member
					.kick(reason)
					.then(async () => {
						return message.reply(`Successfully kicked ${user.tag}.`);
					})
					.catch(async (err) => console.error(err));
			}
			else {
				message.channel.send(`Can't find ${user.tag} in the guild.`);
			}
		}
		else {
			message.channel.send("Please mention the member you want to kick.");
		}
	},
});