const {
	listUserHandler,
	getUserHandler,
	createUserHandler,
	deleteUserHandler,
	updateUserHandler,
} = require("./handlers");

const {
	listUserSchema,
	getUserSchema,
	createUserSchema,
	deleteUserSchema,
	updateUserSchema,
} = require("./schemas");

const listUserOpts = {
	schema: listUserSchema,
	handler: listUserHandler,
};

const getUserOpts = {
	schema: getUserSchema,
	handler: getUserHandler,
	attachValidation: true,
};

const createUserOpts = {
	schema: createUserSchema,
	handler: createUserHandler,
	attachValidation: true,
};

const deleteUserOpts = {
	schema: deleteUserSchema,
	handler: deleteUserHandler,
	attachValidation: true,
};

const updateUserOpts = {
	schema: updateUserSchema,
	handler: updateUserHandler,
	attachValidation: true,
};

function itemRoutes(fastify, option, done) {
	// GET all users
	fastify.get("/users", listUserOpts);

	// Create One item
	fastify.post("/users", createUserOpts);

	// Get single item
	fastify.get("/users/:id", getUserOpts);

	// Delete signle item
	fastify.delete("/users/:id", deleteUserOpts);

	// Update single item
	fastify.put("/users/:id", updateUserOpts);

	done();
}
module.exports = itemRoutes;
