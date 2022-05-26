const { test } = require("tap");
const build = require("../src/app");
const { createUser } = require("../src/user/functions");
const { E02, E01, E00 } = require("../src/utils/errnos");

test(`Test on "users/" for create user`, async (t) => {
	t.beforeEach(() => {
		app = build();
		users = [];
	});

	/* CreateFunction UnitTest */
	t.test("Create User function", async (t) => {
		t.plan(3);
		const functionModule = t.mock("../src/user/functions", {
			"../src/user/users": users,
		});

		t.test(
			"First Create User function should add user to users",
			async (t) => {
				/* User Create 테스트
				 * 유저를 생성하고 생성된 아이디를 반환한다.
				 */
				const name = "john";
				const expected = {
					id: 1,
					name,
				};
				const created = await functionModule.createUser(name);
				t.equal(created, expected.id);
			},
		);
		t.test(
			"Additional Create User function should add user to users",
			async (t) => {
				/* User Create 연속 테스트
				 * 유저를 생성하고 증가된 아이디를 반환한다.
				 */
				const name = "doe";
				const expected = {
					id: 2,
					name,
				};
				const created = await functionModule.createUser(name);
				t.equal(created, expected.id);
			},
		);
		t.test(
			"Conflict Create User function should not add user to users",
			async (t) => {
				/* User Create 연속 테스트
				 * 유저를 생성하고 하지 못하고 0 을 반환한다.
				 */
				const name = "doe";
				const expected = 0;
				const created = await functionModule.createUser(name);
				t.equal(created, expected.id);
			},
		);
	});

	/* CreateUser APITest */
	t.test('POST:createUser - "/users"', async (t) => {
		t.plan(3);
		t.test("POST:createUser - '/users', expect 201", async (t) => {
			/* CreateUser 테스트
			 * 유저를 생성하고 생성된 객체와 201을 반환한다.
			 */
			const name = "john";
			const expected = {
				name,
			};
			const res = await app.inject({
				method: "POST",
				url: "/users",
				payload: { name },
			});
			t.equal(res.statusCode, 201, "return a status code of 201");
			t.equal(
				res.headers["content-type"],
				"application/json; charset=utf-8",
			);
			t.equal(JSON.parse(res.payload).name, expected.name);
		});

		t.test("POST:createUser - '/users', expect 409", async (t) => {
			/* CreateUser 중복값 제약 테스트
			 * 유저를 생성하지 않고 409와 E02를 반환한다.
			 */
			const name = "john";
			const res = await app.inject({
				method: "POST",
				url: "/users",
				payload: { name },
			});
			t.equal(res.statusCode, 409, "return a status code of 409");
			t.equal(
				res.headers["content-type"],
				"application/json; charset=utf-8",
			);
			t.same(JSON.parse(res.payload), E02); // Deep Equal
		});

		t.test("POST:createUser - '/users', expect 400", async (t) => {
			/* CreateUser Validation 테스트
			 * Request를 거부하고 400과 E00을 반환한다.
			 */
			const res = await app.inject({
				method: "POST",
				url: "/users",
				payload: { NoField: 1 },
			});
			t.equal(res.statusCode, 400, "return a status code of 400");
			t.equal(
				res.headers["content-type"],
				"application/json; charset=utf-8",
			);
			t.same(JSON.parse(res.payload), E00); // Deep Equal
		});
	});
});
