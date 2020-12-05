const Discord = require("discord.js");
const client = new Discord.Client();

const config = {
	ownerID: ["284102119408140289", "140788173885276160"],
};

const responseObject = {
	">ping": "pong!",
	">pong": "PANG!",
	">bing": "Google!",
};

const clean = text => {
	if (typeof (text) === "string") {return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));}
	else {return text;}
};

client.on("ready", () => {
	console.log(`Ready and Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
	if (responseObject[message.content]) {
		message.channel.send(responseObject[message.content]);
	}
	else if (message.content.startsWith(">eval")) {
		const args = message.content.split(" ").slice(1);

		if (!config.ownerID.includes(message.author.id)) return;

		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") {evaled = require("util").inspect(evaled);}

			message.channel.send(clean(evaled), { code:"xl" });
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
});

client.login("");