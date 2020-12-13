const { clean } = require("../util");
const { ownerID } = require("../config");

module.exports.eval = {
	description: "eval",
	args: true,
	usage: "<expression>",
	ownerOnly: true,
	async execute(message, args) {

		if (!ownerID.includes(message.author.id)) return;

		try {
			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") {evaled = require("util").inspect(evaled);}

			message.channel.send(clean(evaled), { code:"xl" });
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
};