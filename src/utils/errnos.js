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
};
module.exports = Errnos;
