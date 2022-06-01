"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");

module.exports = async function (fastify, opts) {
	fastify.register(require("@fastify/cors"));

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "src", "plugins"),
		options: Object.assign({}, opts),
	});

	// This loads all plugins defined in routes
	// define your routes in one of these
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "src", "routes"),
		options: Object.assign({}, opts),
	});
	/*
	return fastify({
		logger: {
			prettyPrint:
				process.env["NODE_ENV"] !== "production"
					? {
							translateTime: "HH:MM:ss Z",
							ignore: "pid,hostname",
					  }
					: false,
		},
	});
	*/
};
