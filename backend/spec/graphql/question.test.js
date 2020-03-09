import assert from "assert";
import {after, before, describe, it} from "mocha";
import GQLClient from "../testHelper/graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import GQLServerTestHelper from "../testHelper/GQLServerTestHelper.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import config from "../../graphQL/config.js";

describe("graphql yoga question model", () => {
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

	it("able query questions", async () => {
		const queryQuestions = `
		query getQuestions(
			$EventId: ID!
		){
			questions(EventId: $EventId) {
				id
				EventId
				GuestId
				createdAt
				content
				state
				isStared
				likeCount  
			}
		}
		`;

		const variables = {
			EventId: 2,
		};

		await GQLClient.request(queryQuestions, variables);

		assert(false);
		// assert.deepEqual(res, testCase.question);
	});
});
