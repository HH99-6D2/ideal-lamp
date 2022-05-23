const { test } = require("tap");
const build = require("../src/app");
const prefix = "/users";

test(`Test on"${prefix}/" route GET`, async (t) => {
	const app = build();
	const users = require("../src/user/users");

	t.test(`LIST USER - "${prefix}/", expect 200`, async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/users",
		});
		t.strictEqual(res.statusCode, 200, "return a status code of 200");
		t.strictEqual(
			res.headers["content-type"],
			"application/json; charset=utf-8",
		);
		t.deepEqual(JSON.parse(res.payload), users);
	});

	t.test(`GET USER - "${prefix}/:id", expect 200`, async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/users/1",
		});
		t.strictEqual(res.statusCode, 200, "return a status code of 200");
		t.strictEqual(
			res.headers["content-type"],
			"application/json; charset=utf-8",
		);
		t.deepEqual(JSON.parse(res.payload), users[0]);
	});

	t.test(`GET USER - "${prefix}/:id", expect 404`, async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/users/${users.length + 2}`,
		});
		t.strictEqual(res.statusCode, 404, "return a status code of 404");
		t.strictEqual(res.headers["content-type"], "text/plain; charset=utf-8");
		t.strictEqual(res.payload, `User ${users.length + 2} was not found`);
	});
});
