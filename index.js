const fs = require("fs");
const path = require("path");
const filepath = path.join(__dirname, "db", "GuildConfig.json");
const { token } = require("./config");
const B4C_Client = require("./Client");
const Listener = require("./CommandListener");

// ///////////////////////////////////////////////////////////////////////////////
// Create DB JSON if it does not exist.
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

const clientHandler = new B4C_Client();
const client = clientHandler.Client;
const listener = new Listener(client);

listener.start();

client.login(token);