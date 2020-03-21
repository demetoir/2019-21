import assert from "assert";
import {after, before, beforeEach, describe, it} from "mocha";
import EasyGraphQLTester from "easygraphql-tester";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import models from "../../DB/models";
import likeResolvers from "../../graphQL/model/like/like.resolver.js";
import {createLike} from "../../DB/queries/like.js";
import {createGuest} from "../../DB/queries/guest.js";
import {createQuestion} from "../../DB/queries/question.js";

describe("graphql yoga like model", () => {
	const sequelizeMock = new SequelizeTestHelper();

	let gqlTester = null;

	before(async () => {
		gqlTester = new EasyGraphQLTester(typeDefs, resolvers);

		await Promise.all([sequelizeMock.setup()]);
	});

	after(async () => {
		await Promise.all([sequelizeMock.teardown()]);
	});

	beforeEach(async () => {
		models.Like.destroy({
			where: {},
			truncate: true,
		});
		models.Guest.destroy({
			where: {},
			truncate: true,
		});
		models.Question.destroy({
			where: {},
			truncate: true,
		});
	});

	it("should be able to query 'didILikes'", async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);
		const GuestId = guest.id;

		const question = await createQuestion({
			EventId,
			GuestId,
			content: "content",
		});

		const QuestionId = question.id;

		const like = await createLike({GuestId, QuestionId});

		// gql input
		const query = `
			query get_didILikes(
				$GuestId: ID!
			) {
				didILikes(GuestId: $GuestId) {
					QuestionId  
				}
			}
		`;
		const variables = {
			GuestId,
		};
		const context = null;
		const root = null;

		// when
		let res = await gqlTester.graphql(query, root, context, variables);

		// to remove [Object: null prototype]
		res = JSON.parse(JSON.stringify(res));

		const {
			data: {didILikes: result},
		} = res;

		// than
		const expected = [
			{
				QuestionId: like.QuestionId.toString(),
			},
		];

		assert.deepStrictEqual(result, expected);
	});

	it("should be able to pass schema test 'query didILikes'", async () => {
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

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'didILikes' by resolver", async () => {
		// given
		const GuestId = null;
		const QuestionId = null;
		const like = await createLike({GuestId, QuestionId});

		// when
		const result = await likeResolvers.Query.didILikes(null, {GuestId});

		// than
		assert.equal(result.length, 1);
		const expected = [like];

		assert.deepStrictEqual(result, expected);
	});
});
