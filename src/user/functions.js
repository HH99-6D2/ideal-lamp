const users = require("./users");

async function listUsers() {
	return users;
}

async function getUser(id) {
	return users.find((user) => user.id === id);
}

async function createUser(name) {
	const result =
		name && users.find((user) => user.name === name)
			? 0
			: users.push({ id: users.length + 1, name });
	return result;
}

async function deleteUser(id) {
	const user = { id: id };
	const len = users.length;
	users = users.filter((users) => users.id !== id);

	return len > users.length ? user : null;
}

async function updateUser(id, name) {
	users = users.map((user) => (user.id === id ? { id, name } : user));

	return users.find((user) => user.id === id);
}
module.exports = {
	listUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
};
