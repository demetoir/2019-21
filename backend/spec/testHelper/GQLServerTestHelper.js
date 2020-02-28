import {GraphQLServer} from "graphql-yoga";
import MochaTestHelper from "./MochaTestHelper.js";

export default class GQLServerTestHelper extends MochaTestHelper {
	constructor({typeDefs, resolvers, config}) {
		super();
		this.typeDefs = typeDefs;
		this.resolvers = resolvers;
		this.config = config;
	}

	async setup() {
		const server = new GraphQLServer({
			typeDefs: this.typeDefs,
			resolvers: this.resolvers,
		});

		this.promise = await server.start(this.config);

		return this.promise;
	}

	async teardown() {
		return this.promise.close();
	}
}
