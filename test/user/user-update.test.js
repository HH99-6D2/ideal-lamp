"use strict";
const { test } = require("tap");
const { build } = require("../helper");

test(`Test on "users/"`, async (t) => {
	t.plan(5);
	t.beforeEach(async (t) => {
		t.app = await build(t);
		t.users = require("../../src/models/user");
	});

	// 1. Test SUCCESS / 204 / NOT MODIFIED
	t.test('PUT:updateUser(FORM) - "/users", expect 204', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "PUT",
			url: "/users/1",
			payload: {
				name: "testUser",
			},
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 204, "return a status code of 204");
	});

	// 2. Test FAIL / 415 / BAD CONTENT TYPE
	t.test('PUT:updateUser(JSON) - "/users", expect 415', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "PUT",
			url: "/users/1",
			payload: {
				name: "testUser",
			},
			headers: {
				"content-type": "application/json",
			},
		});
		t.equal(res.statusCode, 415, "return a status code of 415");
	});

	// 3. Test FAIL / 400 / BAD REQUEST
	t.test('PUT:updateUser - "/users", expect 400', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
			url: "/users/1",
			payload: {},
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 400, "return a status code of 400");
	});

	// 4. Test FAIL / 404 / RESOURCE NOT FOUND
	t.test('PUT:updateUser - "/users/9999", expect 404', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
			url: "/users/9999",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 404, "return a status code of 404");
	});

	// 5. Test FAIL / 404 / RESOURCE NOT FOUND
	t.test('PUT:updateUser - "/users/badurl", expect 404', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
			url: "/users/badurl",
			payload: {},
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 404, "return a status code of 404");
	});
});
