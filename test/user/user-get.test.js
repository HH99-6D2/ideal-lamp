"use strict";
const { test } = require("tap");
const { build } = require("../helper");
const { E01, E00 } = require("../../src/utils/errnos");

test(`Test on "users/"`, async (t) => {
	t.plan(3);
	/* OK200:url id 인수 값 테스트 */
	t.beforeEach(async (t) => {
		t.app = await build(t);
		t.users = require("../../src/models/user");
	});
	t.test('GET:getUser - "/users/1", expect 200', async (t) => {
		t.plan(3);
		const res = await t.app.inject({
			method: "GET",
			url: "/users/1",
		});
		t.equal(res.statusCode, 200, "return a status code of 200");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.same(res.payload, JSON.stringify(t.users[0]));
	});

	/* ERROR404:url id 인수 값 테스트 */
	t.test('GET:getUser - "/users/9999", expect 404', async (t) => {
		t.plan(3);
		const res = await t.app.inject({
			method: "GET",
			url: `/users/${t.users.length + 2}`,
		});
		t.equal(res.statusCode, 404, "return a status code of 404");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.equal(res.payload, JSON.stringify(E01));
	});

	/* ERROR400: url id 인수 타입 테스트 */
	t.test('getUser - "/users/s", expect 400', async (t) => {
		t.plan(3);
		const res = await t.app.inject({
			method: "GET",
			url: "/users/s",
		});
		t.equal(res.statusCode, 400, "return a status code of 400");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.equal(res.payload, JSON.stringify(E00));
	});
});
