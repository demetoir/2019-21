import assert from "assert";
import {describe, it} from "mocha";
import * as path from "path";
import {fileLoader, mergeTypes} from "merge-graphql-schemas";
import GQLServerTestHelper from "./GQLServerTestHelper.js";
import config from "../../graphQL/config.js";
import GQLClient from "../graphql/graphqlTestClient.js";

describe("GQLServerTestHelper", () => {
	const typesArray = fileLoader(path.join(__dirname, "./**/*.graphql"), {
		recursive: true,
	});
	const typeDefs = mergeTypes(typesArray, {all: true});
	const resolvers = fileLoader(path.join(__dirname, "./**/*.resolver.js"));

	it("should able to setup and teardown", async () => {
		const gqlServerMock = new GQLServerTestHelper({
			typeDefs,
			resolvers,
			config,
		});

		await gqlServerMock.setup();

		await gqlServerMock.teardown();
	}).timeout(1000);

	it("should able to connect from gql client", async () => {
		const gqlServerMock = new GQLServerTestHelper({
			typeDefs,
			resolvers,
			config,
		});

		await gqlServerMock.setup();

		const query = `
		query get_hello(
			$name: String!
		){
			hello(input: $name) {
				world
			}
		}
		`;

		const variables = {
			name: "this is name",
		};

		const res = await GQLClient.request(query, variables);
		const expected = {hello: [{world: "hello"}]};

		assert.deepStrictEqual(res, expected);

		await gqlServerMock.teardown();
	}).timeout(1000);
});
