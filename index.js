const responseObject = {
	">pong": "PANG!",
	">bing": "Google!",
};

const fs = require("fs");
const { Client, Collection } = require("discord.js");
const { prefix, token, ownerID } = require("./config");

const client = new Client({
	disableMentions: "everyone",
	presence: { activity: { name: "Tylerr, write something here...", type: "COMPETING" }, status: "online" },
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./modules").filter(file => file.endsWith(".js"));

commandFiles.forEach(file => {
	const exported = require(`./modules/${file}`);

	Object.entries(exported).forEach(cmd => {
		cmd[1].name = cmd[0];
		client.commands.set(cmd[0], cmd[1]);
	});
});

client.on("ready", () => {
	console.info(`Ready and logged in as ${client.user.tag}!`);
});

client.on("message", message => {

	if (responseObject[message.content]) {
		message.channel.send(responseObject[message.content]);
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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

});

client.login(token);