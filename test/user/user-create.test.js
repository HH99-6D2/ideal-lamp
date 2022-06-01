"use strict";
const { test } = require("tap");
const { build } = require("../helper");

test(`Test on "users/"`, async (t) => {
	t.plan(3);
	/* OK200:url id 인수 값 테스트 */
	t.beforeEach(async (t) => {
		t.app = await build(t);
		t.users = require("../../src/models/user");
	});
	t.test('POST:createUser - "/users", expect 201', async (t) => {
		t.plan(2);
		const res = await t.app.inject({
			method: "GET",
			url: "/users/1",
			payload: {
				username: "testUser",
			},
		});
		t.equal(res.statusCode, 201, "return a status code of 201");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
	});
});
