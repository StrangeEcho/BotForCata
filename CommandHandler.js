const { ownerID } = require("./config");
const PrefixSupplier = require("./PrefixSupplier");

module.exports = async message => {

	const prefix = PrefixSupplier(message);
	const handler = message.client.Handler;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = handler.commands.get(commandName)
		|| handler.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// check if ownerOnly: true on a command
	if (command.ownerOnly && !ownerID.includes(message.member.id)) {
		return;
	}

	// check if guildOnly: true on a command
	if (command.guildOnly && message.channel.type === "dm") {
		return message.reply("I can't execute that command inside DMs!");
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
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply("there was an error trying to execute that command!");
	}
};
