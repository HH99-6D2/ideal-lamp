function build(opts = {}) {
	const fastify = require("fastify")({
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
	fastify.register(require("./user/routes"));
	return fastify;
}

module.exports = build;
