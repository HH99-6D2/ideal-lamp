const _User = {
	type: "object",
	properties: {
		id: { type: "integer" /*"integer"*/ },
		name: { type: "string" },
	},
};

const _IDSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
	},
	required: ["id"],
};

const _NameBodySchema = {
	type: "object",
	required: ["name"],
	properties: {
		name: { type: "string" },
	},
};

const _ErrorMessageSchema = {
	type: "object",
	properties: {
		statusCode: { type: "integer" },
		error: { type: "string" },
		message: { type: "string" },
	},
};

const listUserSchema = {
	response: {
		200: {
			type: "array",
			users: _User,
		},
	},
};

const getUserSchema = {
	params: _IDSchema,
	response: {
		200: _User,
		404: _ErrorMessageSchema,
	},
};

const createUserSchema = {
	body: _NameBodySchema,
	response: {
		201: _User,
	},
};

const deleteUserSchema = {
	params: _IDSchema,
	response: {
		200: _User,
		400: _ErrorMessageSchema,
		404: _ErrorMessageSchema,
	},
};

const updateUserSchema = {
	params: _IDSchema,
	body: _NameBodySchema,
	response: {
		200: _User,
		400: _ErrorMessageSchema,
		404: _ErrorMessageSchema,
	},
};

module.exports = {
	listUserSchema,
	getUserSchema,
	createUserSchema,
	deleteUserSchema,
	updateUserSchema,
};
