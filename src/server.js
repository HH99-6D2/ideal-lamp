const PORT = 3000;
const server = require("./app")();

server.register(require("@fastify/cors"));
server.listen(PORT, "0.0.0.0", (err, address) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
	console.log("address: ", address);
});
