const Errnos = {
	E00: {
		statusCode: 400,
		error: "Bad Request",
		message: `Resource not found`,
	},
	E01: {
		statusCode: 404,
		error: "Resource Not Found",
		message: `User Resource not found`,
	},
	E02: {
		statusCode: 409,
		error: "Resource Conflict",
		message: `User Resource cannot be as input`,
	},
};
module.exports = Errnos;
