import assert from "assert";
import {GraphQLServer} from "graphql-yoga";
import {after, before, describe, it} from "mocha";
import GQLClient from "./graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import config from "../../graphQL/config.js";
import models from "../../DB/models";

describe("graphql yoga question model", () => {
	let app = null;

	before(async () => {
		const server = new GraphQLServer({
			typeDefs,
			resolvers,
		});

		const serverPromise = server.start(config);
		const initDBPromise = models.sequelize.sync();

		const res = await Promise.all([serverPromise, initDBPromise]);

		app = res[0];
	});

	after(() => {
		app.close();
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
		const res = await GQLClient.request(queryQuestions, variables);

		assert(false);
		// assert.deepEqual(res, testCase.question);
	});
});
