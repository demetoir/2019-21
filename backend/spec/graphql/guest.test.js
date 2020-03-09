import assert from "assert";
import {after, before, describe, it} from "mocha";
import GQLClient from "../testHelper/graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import config from "../../graphQL/config.js";
import GQLServerTestHelper from "../testHelper/GQLServerTestHelper.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";

describe("graphql yoga guest model", () => {
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

	it("able query guest", async () => {
		const query = `
		query getGuests(
			$EventId: ID!
		){
			guests(EventId: $EventId) {
				id
				name
				isAnonymous
				company
				email
			}
		}
		`;

		const variables = {
			EventId: 2,
		};

		await GQLClient.request(query, variables);

		assert(false);
	});
});
