import {GraphQLServer} from "graphql-yoga";
import {after, before, describe, it} from "mocha";
import GQLClient from "./graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import config from "../../graphQL/config.js";
import models from "../../DB/models";

describe("graphql yoga like model", () => {
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
