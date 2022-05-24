const { test } = require("tap");
const build = require("../src/app");
const { E01, E00 } = require("../src/utils/errnos");

test(`Test on "users/"`, async (t) => {
	t.beforeEach(() => {
		app = build();
		users = require("../src/user/users");
	});

	/* OK200:url 테스트 */
	t.test('GET:listUsers - "/users", expect 200', async (t) => {
		/* User List 테스트
		 * 항상 200을 반환해야하고, 빈 배열의 유저를 반환하거나 유저 목록을 반환한다.
		 */
		const res = await app.inject({
			method: "GET",
			url: "/users",
		});
		t.equal(res.statusCode, 200, "return a status code of 200");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.same(JSON.parse(res.payload), users); // Deep Equal
	});

	/* OK200:url id 인수 값 테스트 */
	t.test('GET:getUser - "/users/1", expect 200', async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/users/1",
		});
		t.equal(res.statusCode, 200, "return a status code of 200");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.same(JSON.parse(res.payload), users[0]);
	});

	/* ERROR404:url id 인수 값 테스트 */
	t.test('GET:getUser - "/users/9999", expect 404', async (t) => {
		const res = await app.inject({
			method: "GET",
			url: `/users/${users.length + 2}`,
		});
		t.equal(res.statusCode, 404, "return a status code of 404");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.equal(res.payload, JSON.stringify(E01));
	});

	/* ERROR400: url id 인수 타입 테스트 */
	t.test('getUser - "/users/s", expect 400', async (t) => {
		const res = await app.inject({
			method: "GET",
			url: "/users/s",
		});
		t.equal(res.statusCode, 400, "return a status code of 400");
		t.equal(res.headers["content-type"], "application/json; charset=utf-8");
		t.equal(res.payload, JSON.stringify(E00));
	});
});
