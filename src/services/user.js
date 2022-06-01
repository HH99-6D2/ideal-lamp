const users = require("../models/user");

async function listUsers() {
	return users;
}

async function getUser(id) {
	return users.find((user) => user.id === id);
}

async function createUser(name) {
	const result =
		users.find((user) => user.name === name)
			? undefined
			: users.push({ id: users.length + 1, name });
	return result;
	/*
	return result ?
		result :
		USER_CREATE_ERR_001;
	*/
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
