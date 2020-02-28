import assert from "assert";
import {after, before, describe, it} from "mocha";
import GQLClient from "../testHelper/graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import GQLServerTestHelper from "../testHelper/GQLServerTestHelper.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import config from "../../graphQL/config.js";

describe("graphql yoga promise hello", () => {
	const gqlServerMock = new GQLServerTestHelper({
		typeDefs,
		resolvers,
		config,
	});
	const sequelizeMock = new SequelizeTestHelper();

	before(async () => {
		await Promise.all([gqlServerMock.setup(), sequelizeMock.setup()]);
	});

	after(async () => {
		await Promise.all([gqlServerMock.teardown(), sequelizeMock.teardown()]);
	});

	it("able query hello", async () => {
		const query = `
		query {
			hello {
				name
				value
			}
		}`;
		const variables = undefined;
		const res = await GQLClient.request(query, variables);
		const expect = {hello: {name: "hello", value: 12313}};

		assert.deepStrictEqual(expect, res);
	});
});
