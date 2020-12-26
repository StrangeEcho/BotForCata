const { Client } = require("discord.js");
const CommandHandler = require("./CommandHandler");
const PrefixSupplier = require("./PrefixSupplier");

module.exports = class B4C_Client {
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
};