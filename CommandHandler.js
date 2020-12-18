const { Collection } = require("discord.js");
const config = require("./config");
const PrefixSupplier = require("./PrefixSupplier");
const fs = require("fs");

module.exports = class CommandHandler {
	constructor(client, {
		handleEdits = true,
		prefix = config.prefix,
	} = {}) {

		this.client = client;

		this.prefix = typeof prefix === "function" ? prefix.bind(this) : prefix;

		this.prefixes = new Collection();

		this.handleEdits = Boolean(handleEdits);

		this.commands = new Collection();

		this.categories = new Collection();

		this.startup();

	}

	startup() {
		this.client.once("ready", () => {
			console.log("Commandhandler | Loaded");

			const CommandsWithPrefixes = this.commands.filter((v, k) => v.prefix[0] !== null);

			const Dictionary = {};
			CommandsWithPrefixes.forEach((v, k) => v.aliases.map((a) => Dictionary[`${v.prefix}${a}`] = v));

			this.client.dictionary = Dictionary;

			this.client.on("message", async (message) => {
				if (message.partial) await message.fetch();
				this.handle(message, CommandsWithPrefixes);
			});

			if (this.handleEdits) {
				this.client.on("messageUpdate", async (oldMessage, newMessage) => {
					if (oldMessage.partial) await oldMessage.fetch();
					if (newMessage.partial) await newMessage.fetch();
					if (oldMessage.content === newMessage.content) return;
					if (this.handleEdits) this.handle(newMessage);
				});
			}
		});
	}


	handle(message) {

		const prefix = PrefixSupplier(message);
		const commands = this.commands;

		let commandName;
		const dictMatch = message.client.dictionary[message.content.trim().split(/ +/)[0]];
		if (dictMatch) {
			commandName = dictMatch.name;
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		commandName = args.shift().toLowerCase();

		const command = commands.get(commandName)
			|| commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		// if (!message.content.startsWith(prefix)
		// 	&& !message.content.startsWith(commandPrefix)
		// 	|| message.author.bot) return;

		// check if ownerOnly: true on a command
		{
			if (command.ownerOnly && !config.ownerID.includes(message.member.id)) {
				return;
			}
		}

		// check if guildOnly: true on a command
		if (command.guildOnly && message.channel.type === "dm") {
			return message.reply("I can't execute that command inside DMs!");
		}

		// TODO: permissions check method.

		// if (!message.member.permissions.has(command?.userPermissions)) {
		// 	return message.client.emit("MissingPermissions", message);
		// }

		// if (!message.guild.me.permissions.has(command?.clientPermissions)) {
		// 	return message.client.emit("ClientMissingPermissions", message);
		// }

		if (command.nsfw && !message.channel.nsfw) {
			return message.reply("I can't execute that command outside of a NSFW channel!");
		}

		// check if args: true
		if (command.args && !args.length) {
			let reply = "You didn't provide any arguments.";

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		try {

			if (command.typing) {
				message.channel.startTyping();
			}

			// TODO: execute class
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply("there was an error trying to execute that command!");
		}
		finally {
			if (command.typing) {
				message.channel.stopTyping();
			}
		}
	}
	// Function to do it all xd
	register() {

		const commandFiles = fs.readdirSync("./modules").filter(file => file.endsWith(".js"));

		commandFiles.forEach(file => {
			const exported = require(`./modules/${file}`);
			this.categories.set(file.slice(0, file.indexOf(".")), exported);

			Object.entries(exported).forEach(cmd => {

				if (typeof cmd[1] !== "object") {
					throw new Error("Command object is missing from exported module.");
				}
				const cmdName = cmd[0];
				cmd[1].name = cmdName;
				!cmd[1].aliases.length > 0 ? cmd[1].aliases = [cmdName] : cmd[1].aliases.push(cmdName);

				console.log(cmd);
				this.commands.set(cmdName, cmd[1]);
			});
		});
	}
};
