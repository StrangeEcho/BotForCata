module.exports = class Listener {
	constructor(client) {
		this.client = client;
	}

	start() {
		const client = this.client;
		console.log("Listener | Loaded");

		client.on("ready", () => {
			console.info(`Ready and logged in as ${client.user.tag}!`);
		});

		client.on("CommandFinished", async (cmd, args, author) => {
			const date = new Date();
			console.info(`CommandFinished | ${cmd.name} ${args.length ? `: "${args}"` : ""}\nExecuted by ${author.tag} [${author.id}]\n${date.toLocaleString("en-GB")}`);
		});

		client.on("MissingPermissions", async (cmd, args, author, message) => {
			message.channel.send("You do not have the required permissions.");
		});

		client.on("ClientMissingPermissions", async (cmd, args, author, message) => {
			message.channel.send("Sorry, I do not have the required permissions.");
		});
	}
};
