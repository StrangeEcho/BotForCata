// eslint-disable-next-line no-unused-vars
const { BitField, PermissionString } = require("discord.js");

module.exports = class Command {
	constructor({
		aliases = [],
		args = false,
		category = null,
		client,
		clientPermissions = null,
		description = "No description provided.",
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
		this.aliases = Array.isArray(aliases) ? aliases : [aliases];
		/**
		 * @type {boolean}
		 */
		this.args = Boolean(args);
		/**
		 * @type {string}
		 * Is set automatically unless specified.
		 */
		this.category = category;
		/**
		 * @type {Client}
		 */
		this.client = client;
		/**
		 * @type {BitField<PermissionString>}
		 */
		this.clientPermissions = clientPermissions !== null ? (Array.isArray(clientPermissions) ? clientPermissions : [clientPermissions]) : null;
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
		this.prefix = Array.isArray(prefix) ? prefix : [prefix];
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
		this.userPermissions = userPermissions !== null ? (Array.isArray(userPermissions) ? userPermissions : [userPermissions]) : null;
	}

	static throw(...message) {
		throw new Error(...message);
	}
};