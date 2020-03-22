import assert from "assert";
import gql from "graphql-tag";
import EasyGraphQLTester from "easygraphql-tester";
import {after, before, beforeEach, describe, it} from "mocha";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import models from "../../DB/models";
import {createGuest} from "../../DB/queries/guest.js";
import {createQuestion} from "../../DB/queries/question.js";
import questionResolvers from "../../graphQL/model/question/question.resolver.js";
import {createEvent} from "../../DB/queries/event.js";

describe("graphql yoga question model", () => {
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
		models.Event.destroy({
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

	it("should be able to query 'questions'", async () => {
		// given
		const event = await createEvent({
			eventName: "event name",
			eventCode: "event code",
			HostId: null,
		});
		const EventId = event.id;
		const guest = await createGuest(EventId);
		const GuestId = guest.id;
		const question = await createQuestion({
			EventId,
			GuestId,
			QuestionId: null,
		});

		// gql input
		const query = gql`
            query getQuestions($EventId: ID!) {
                questions(EventId: $EventId) {
                    id
                    EventId
                    GuestId
                    createdAt
                    content
                    state
                    isStared
                    likeCount
                    QuestionId
                }
            }
		`;
		const variables = {
			EventId,
		};
		const context = null;
		const root = null;

		// when
		let res = await gqlTester.graphql(query, root, context, variables);

		// to remove [Object: null prototype]
		res = JSON.parse(JSON.stringify(res));
		const {
			data: {questions: result},
		} = res;

		// than
		const expected = [
			{
				EventId: question.EventId.toString(),
				GuestId: question.GuestId.toString(),
				QuestionId: question.QuestionId,
				content: question.content,
				createdAt: question.createdAt.getTime().toString(),
				id: question.id.toString(),
				isStared: question.isStared,
				likeCount: question.likeCount,
				state: question.state,
			},
		];

		assert.deepStrictEqual(result, expected);
	});

	it("should be able to pass schema test 'query questions'", async () => {
		const query = gql`
            query getQuestions($EventId: ID!) {
                questions(EventId: $EventId) {
                    id
                    EventId
                    GuestId
                    createdAt
                    content
                    state
                    isStared
                    likeCount
                    QuestionId
                }
            }
		`;

		const variables = {
			EventId: 2,
		};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'questions' by resolver", async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);
		const GuestId = guest.id;
		const question = await createQuestion({
			EventId,
			GuestId,
			QuestionId: null,
		});

		// when
		const result = await questionResolvers.Query.questions(null, {EventId});

		// than
		assert.equal(result.length, 1);

		const expected = [question];

		assert.deepStrictEqual(result, expected);
	});
});
