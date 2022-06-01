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
	t.test('POST:createUser(JSON) - "/users", expect 201', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
			url: "/users",
			payload: {
				name: "testUser",
			},
			headers: {
				"content-type": "application/json",
			},
		});
		t.equal(res.statusCode, 415, "return a status code of 415");
	});

	t.test('POST:createUser(FORM) - "/users", expect 201', async (t) => {
		t.plan(3);
		const res = await t.app.inject({
			method: "POST",
			url: "/users",
			payload: {
				name: "testUser",
			},
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 201, "return a status code of 201");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.same(res.payload, JSON.stringify({ id: 1 }));
	});
	/*
	t.test('POST:createUser - "/users", expect 400', async (t) => {
		t.plan(2);
		const res = await t.app.inject({
			method: "POST",
			url: "/users",
			payload: {},
		});
		t.equal(res.statusCode, 400, "return a status code of 400");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
	});
	*/
});
