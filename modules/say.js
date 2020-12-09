module.exports.say = {
	description: "Repeats Stuff Ig",
	ownerOnly: true,
	execute(message, args) {
		const sayMessage = args.join(" ");
		message.delete().catch(err => console.log(err));
		message.channel.send(sayMessage);
	},
};