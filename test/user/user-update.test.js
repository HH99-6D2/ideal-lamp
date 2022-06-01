"use strict";
const { test } = require("tap");
const { build } = require("../helper");

test(`Test on "users/"`, async (t) => {
	t.plan(5);
	/* OK200:url id 인수 값 테스트 */
	t.beforeEach(async (t) => {
		t.app = await build(t);
		t.users = require("../../src/models/user");
	});
	// 1. Test SUCCESS
	t.test('PUT:updateUser(FORM) - "/users", expect 204', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
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
	// 2. Test FAIL BAD content Type
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

	// 3. Test FAIL BAD content request
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

	// 4. Test FAIL BAD url request
	t.test('PUT:updateUser - "/users/badurl", expect 400', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
			url: "/users/badurl",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 400, "return a status code of 404");
	});

	// 5. Test FAIL not found resouce
	t.test('PUT:updateUser - "/users/9999", expect 404', async (t) => {
		t.plan(1);
		const res = await t.app.inject({
			method: "POST",
			url: "/users/9999",
			payload: {},
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});
		t.equal(res.statusCode, 404, "return a status code of 404");
	});
});
