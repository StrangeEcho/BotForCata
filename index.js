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

const responseObject = {
	">pong": "PANG!",
	">bing": "Google!",
};

const { Client, Collection } = require("discord.js");
const { token } = require("./config");
const CommandHandler = require("./CommandHandler");

const client = new Client({
	disableMentions: "everyone",
	presence: { activity: { name: "Tylerr, write something here...", type: "COMPETING" }, status: "online" },
});

client.Handler = {};
client.Handler.commands = new Collection();
client.Handler.categories = new Collection();

const commandFiles = fs.readdirSync("./modules").filter(file => file.endsWith(".js"));

commandFiles.forEach(file => {
	const exported = require(`./modules/${file}`);
	client.Handler.categories.set(file.slice(0, file.indexOf(".")), exported);

	Object.entries(exported).forEach(cmd => {
		cmd[1].name = cmd[0];
		client.Handler.commands.set(cmd[0], cmd[1]);
	});
});

client.on("ready", () => {
	console.info(`Ready and logged in as ${client.user.tag}!`);
});

client.on("message", async message => {

	if (responseObject[message.content]) {
		message.channel.send(responseObject[message.content]);
	}

	CommandHandler(message);

});

client.login(token);