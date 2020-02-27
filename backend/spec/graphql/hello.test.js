import assert from "assert";
import {GraphQLServer} from "graphql-yoga";
import {after, before, describe, it} from "mocha";
import GQLClient from "./graphqlTestClient.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import config from "../../graphQL/config.js";
import models from "../../DB/models";

describe("graphql yoga server hello", () => {
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
