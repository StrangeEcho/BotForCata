const fs = require("fs");
const path = require("path");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config");

module.exports.say = {
	description: "Repeats message.",
	args: true,
	ownerOnly: true,
	execute(message, args) {
		const sayMessage = args.join(" ");
		message.delete().catch(err => console.log(err));
		message.channel.send(sayMessage);
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

module.exports.kick = {
	description: "Kicks a memner",
    args: true,
    usage: '<user> <reason>',
    execute(message, args) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                .kick 
                .then(() => {            
            message.reply(`Successfully kicked ${user.tag}`);
          })
            }

            }
        }
	},
};
