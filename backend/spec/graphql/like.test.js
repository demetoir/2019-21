import {after, before, describe, it} from "mocha";
import GQLClient from "../testHelper/graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import GQLServerTestHelper from "../testHelper/GQLServerTestHelper.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import config from "../../graphQL/config.js";

describe("graphql yoga like model", () => {
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

	it("able query didILike", async () => {
		const query = `
		query get_didILikes(
			$GuestId: ID!
		){
			didILikes(GuestId: $GuestId) {
				QuestionId  
			}
		}
		`;

		const variables = {
			GuestId: 2,
		};

		await GQLClient.request(query, variables);
		// todo add assertion
	});
});
