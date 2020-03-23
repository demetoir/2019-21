import assert from "assert";
import {after, before, beforeEach, describe, it} from "mocha";
import gql from "graphql-tag";
import EasyGraphQLTester from "easygraphql-tester";
import emojiResolvers from "../../graphQL/model/emoji/emoji.resolver.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import {createEmoji} from "../../DB/queries/emoji.js";
import models from "../../DB/models";
import {findOrCreateEvent} from "../../DB/queries/event.js";
import {createQuestion} from "../../DB/queries/question.js";
import {createGuest} from "../../DB/queries/guest.js";

describe("graphql yoga emoji model", () => {
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
		models.Emoji.destroy({
			where: {},
			truncate: true,
		});
	});

	it("should be able to query 'emojis'", async () => {
		// given
		const eventName = "event name";
		const eventCode = "event code";
		const HostId = null;
		const event = await findOrCreateEvent({eventName, eventCode, HostId});
		const EventId = event.id;

		const content = "content";
		const GuestId = null;
		const question = await createQuestion({EventId, content, GuestId});
		const QuestionId = question.id;

		const name = "name";
		const emoji = await createEmoji({GuestId, QuestionId, name, EventId});

		// gql input
		const query = gql`
            query get_emojis($EventId: ID!) {
                emojis(EventId: $EventId) {
                    name
                    count
                    QuestionId
                    createdAt
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
			data: {emojis: realEmojis},
		} = res;

		// than
		const expected = [
			{
				name: emoji.name,
				count: 1,
				QuestionId: emoji.QuestionId,
				createdAt: emoji.createdAt.toISOString(),
			},
		];

		assert.deepStrictEqual(realEmojis, expected);
	});

	it("should be able to pass schema test 'query emojis'", async () => {
		const query = gql`
            query query_emojis($EventId: ID!) {
                emojis(EventId: $EventId) {
                    name
                    count
                    QuestionId
                }
            }
		`;

		const variables = {
			EventId: 2,
		};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'emojis' by resolver", async () => {
		// given
		const EventId = null;
		const GuestId = null;
		const QuestionId = null;
		const name = "name";

		const emoji = await createEmoji({GuestId, QuestionId, name, EventId});

		// when
		const real = await emojiResolvers.Query.emojis(null, {EventId});

		// than
		assert.equal(real.length, 1);

		const expected = {
			QuestionId,
			name,
			count: 1,
			createdAt: emoji.createdAt.toISOString(),
		};
		const realEmoji = real[0];

		assert.deepStrictEqual(realEmoji, expected);
	});

	it("should be able to query 'emojiPicks'", async () => {
		const eventName = "event name";
		const eventCode = "event code";
		const HostId = null;
		const event = await findOrCreateEvent({eventName, eventCode, HostId});
		const EventId = event.id;

		const guest = await createGuest(EventId);
		const GuestId = guest.id;

		const content = "content";

		const question = await createQuestion({EventId, content, GuestId});
		const QuestionId = question.id;

		const name = "name";

		await createEmoji({GuestId, QuestionId, name, EventId});

		const query = gql`
            query get_emojipicks($EventId: ID!, $GuestId: ID!) {
                emojiPicks(EventId: $EventId, GuestId: $GuestId) {
                    name
                    QuestionId
                }
            }
		`;
		const variables = {
			EventId,
			GuestId,
		};
		const context = null;
		const root = null;

		let real = await gqlTester.graphql(query, root, context, variables);

		real = JSON.parse(JSON.stringify(real));

		const expected = {data: {emojiPicks: [{QuestionId, name}]}};

		assert.deepStrictEqual(real, expected);
	});

	it("should be able to pass schema test 'query emojiPicks'", async () => {
		const query = gql`
            query get_emojipicks($EventId: ID!, $GuestId: ID!) {
                emojiPicks(EventId: $EventId, GuestId: $GuestId) {
                    name
                    QuestionId
                }
            }
		`;

		const variables = {
			EventId: 2,
			GuestId: 4,
		};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'emojiPicks' by resolver", async () => {
		// given
		const EventId = null;
		const GuestId = null;
		const QuestionId = null;
		const name = "name";

		await createEmoji({GuestId, QuestionId, name, EventId});

		// when
		const res = await emojiResolvers.Query.emojiPicks(null, {
			EventId,
			GuestId,
		});

		// than
		const expected = [{name, QuestionId}];

		assert.deepStrictEqual(res, expected);
	});
});
