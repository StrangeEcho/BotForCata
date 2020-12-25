// eslint-disable-next-line no-unused-vars
const { Client, BitField, PermissionString } = require("discord.js");

module.exports = class Command {
	constructor({
		aliases = new Array(0),
		args = false,
		client,
		clientPermissions = null,
		description = "Empty description",
		execute,
		guildOnly = false,
		ownerOnly = false,
		prefix = null,
		typing = false,
		usage = null,
		userPermissions = null,
	}) {
		if (typeof execute !== "function") {
			this.throw("Command doesnt have execute function!", this);
		}

		/**
		 * @type {Array}
		 */
		this.aliases = Array.isArray(aliases) ? aliases : new Array(aliases);
		/**
		 * @type {boolean}
		 */
		this.args = Boolean(args);
		/**
		 * @type {Client}
		 */
		this.client = client;
		/**
		 * @type {BitField<PermissionString>}
		 */
		this.clientPermissions = clientPermissions && Array.isArray(clientPermissions) ? clientPermissions : new Array(clientPermissions);
		/**
		 * @type {string}
		 */
		this.description = description;
		/**
		 * @type {Function}
		 */
		this.execute = execute;
		/**
		 * @type {boolean}
		 */
		this.guildOnly = Boolean(guildOnly);
		/**
		 * @type {boolean}
		 */
		this.ownerOnly = Boolean(ownerOnly);
		/**
		 * @type {Array}
		 */
		this.prefix = Array.isArray(prefix) ? prefix : new Array(prefix);
		/**
		 * @type {boolean}
		 */
		this.typing = Boolean(typing);
		/**
		 * @type {string[]}
		 */
		this.usage = usage && Array.isArray(usage) ? usage : new Array(usage);
		/**
		 * @type {BitField<PermissionString>}
		 */
		this.userPermissions = userPermissions && Array.isArray(userPermissions) ? userPermissions : new Array(userPermissions);
	}

	static throw(...message) {
		throw new Error(...message);
	}
};