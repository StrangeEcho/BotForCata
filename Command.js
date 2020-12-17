module.exports = class Command {
	constructor({
		aliases = new Array(0),
		description = "Empty description",
		clientPermissions = null,
		userPermissions = null,
		typing = false,
		execute,
		ownerOnly = false,
		args = false,
		usage = "Empty usage",
		prefix = null,
	}) {
		if (typeof execute !== "function") {
			throw new Error("Command doesnt have execute function!", this);
		}

		this.execute = execute;

		this.aliases = Array.isArray(aliases) ? aliases : new Array(aliases);

		this.description = description;

		this.usage = usage;

		this.typing = Boolean(typing);

		this.clientPermissions = clientPermissions;

		this.userPermissions = userPermissions;

		this.ownerOnly = Boolean(ownerOnly);

		this.args = Boolean(args);

		this.prefix = Array.isArray(prefix) ? prefix : new Array(prefix);
	}
};