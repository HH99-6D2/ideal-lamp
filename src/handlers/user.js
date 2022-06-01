const {
	listUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
} = require("../services/user");
const { E00, E01, E02 } = require("../utils/errnos");

module.exports = {
	listUserHandler: async (req, reply) => {
		return reply.send(await listUsers());
	},
	getUserHandler: async (req, reply) => {
		if (req.validationError) return reply.code(400).send(E00);
		const { id } = req.params;
		const user = await getUser(id);

		return user ? reply.code(200).send(user) : reply.code(404).send(E01);
	},
	createUserHandler: async (req, reply) => {
		if (req.validationError) reply.code(400).send(E00);
		const { name } = req.body;
		const id = await createUser(name);
		return id
			? reply.code(201).send({ id, name })
			: reply.code(409).send(E02);
	},
	deleteUserHandler: async (req, reply) => {
		if (req.valicationError) reply.code(400).send(E00);
		const { id } = req.params;

		return (await deleteUser(id))
			? reply.code(200).send("OK")
			: reply.code(404).send(E01);
	},
	updateUserHandler: async (req, reply) => {
		const { id } = req.params;
		const { name } = req.body;
		const user = await updateUser(id, name);

		return item ? reply.code(200).send(user) : reply.code(404).send(E01);
	},
};
