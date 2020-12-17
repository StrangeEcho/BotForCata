// ///////////////////////////////////////////////////////////////////////////////
// Create DB JSON if it does not exist.
const fs = require("fs");
const path = require("path");
const filepath = path.join(__dirname, "db", "GuildConfig.json");

try {
	new fs.readFileSync(filepath, "utf8");
}
catch {
	const input = {
		data: "This is the beginning of your file.",
	};
	fs.writeFileSync(filepath, JSON.stringify(input, null, 4), "utf8", (err) => {
		if (err) {
			return console.log(err);
		}
		return console.log("DB created.");
	});
}

// ///////////////////////////////////////////////////////////////////////////////
const { Client } = require("discord.js");
const { token } = require("./config");
const CommandHandler = require("./CommandHandler");
const PrefixSupplier = require("./PrefixSupplier");

class BotClient {
	constructor() {

		this.Client = new Client({
			disableMentions: "everyone",
			presence: { activity: { name: "Tylerr, write something here...", type: "COMPETING" }, status: "online" },
		});


		this.commandHandler = new CommandHandler(this.Client, {
			handleEdits: true,
			prefix: (message) => PrefixSupplier(message),
		});

		this.Client.commandHandler = this.commandHandler;

		this.commandHandler.register();
	}
}

const clientHandler = new BotClient();
const client = clientHandler.Client;

client.on("ready", () => {
	console.info(`Ready and logged in as ${client.user.tag}!`);
});

client.on("MissingPermissions", async message => {
	message.channel.send("You do not have the required permissions.");
});

client.on("ClientMissingPermissions", async message => {
	message.channel.send("Sorry, I do not have the required permissions.");
});

client.login(token);

module.exports.clientHandler = clientHandler;