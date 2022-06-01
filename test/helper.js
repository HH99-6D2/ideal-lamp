"use strict";

const { build: buildApplication } = require("fastify-cli/helper");
const path = require("path");
const AppPath = path.join(__dirname, "..", "app.js");

// 이 config를 테스트에 필요한 모든 configurations로 채우세요
function config() {
	return {};
}

// automatically build and tear down our instance
// 자동적으로 build하고 삭제합니다.
async function build(t) {
	// you can set all the options supported by the fastify CLI command
	// fastify CLI를 통해 options를 설정할 수 있습니다.
	const argv = [AppPath];

	// fastify-plugin ensures that all decorators
	// fastify-plugin은 모든 decorators들이
	// are exposed for testing purposes, this is
	// 테스팅을 목적으로 노출된 것이라고 확신하고 불러옵니다.
	// different from the production setup
	// 따라서 이것은 production 설정과는 다른 것이라고 생각합니다.
	const app = await buildApplication(argv, config());

	// tear down our app after we are done
	// 우리가 종료한 뒤에 app을 삭제합니다
	t.teardown(app.close.bind(app));

	return app;
}

module.exports = {
	config,
	build,
};
