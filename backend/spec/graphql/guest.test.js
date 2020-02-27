import assert from "assert";
import {GraphQLServer} from "graphql-yoga";
import {after, before, describe, it} from "mocha";
import GQLClient from "./graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import config from "../../graphQL/config.js";
import models from "../../DB/models";

describe("graphql yoga guest model", () => {
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
		const res = await GQLClient.request(query, variables);

		assert(false);
	});
});
