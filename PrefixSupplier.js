const GuildConfig = require("./db/GuildConfig.json");
const config = require("./config");

module.exports = (message) => {

	if (message.guild) {

		const prefix = GuildConfig[message.guild.id]?.prefix;

		if (!prefix) return config.prefix;

		return prefix;
	}
	return config.prefix;
};