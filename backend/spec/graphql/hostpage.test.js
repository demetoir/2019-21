import assert from "assert";
import gql from "graphql-tag";
import {after, before, beforeEach, describe, it} from "mocha";
import EasyGraphQLTester from "easygraphql-tester";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import models from "../../DB/models";
import hostpageResolvers from "../../graphQL/model/hostpage/hostpage.resolver.js";
import {AUTHORITY_TYPE_HOST} from "../../constants/authorityTypes.js";
import {createEvent} from "../../DB/queries/event.js";
import {findOrCreateHostByOAuth} from "../../DB/queries/host.js";
import {createHashtag} from "../../DB/queries/hashtag.js";

describe("graphql yoga hostpage model", () => {
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
		models.Host.destroy({
			where: {},
			truncate: true,
		});
		models.Hashtag.destroy({
			where: {},
			truncate: true,
		});
		models.Event.destroy({
			where: {},
			truncate: true,
		});
	});

	it("should be able to query 'init'", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});

		const HostId = host.id;
		const event1 = await createEvent({
			eventCode: "eventCode1",
			eventName: "eventname1",
			HostId,
		});
		const event2 = await createEvent({
			eventCode: "eventCode2",
			eventName: "eventname2",
			HostId,
		});
		const hashtag1 = await createHashtag({name: "one", EventId: event1.id});
		const hashtag2 = await createHashtag({name: "two", EventId: event2.id});

		const GuestId = null;

		// gql input
		const query = gql`
            query get_init {
                init {
                    host {
                        id
                        oauthId
                        name
                        email
                        emailFeedBack
                        image
                    }
                    events {
                        id
                        eventCode
                        eventName
                        moderationOption
                        replyOption
                        createdAt
                        updatedAt
                        startAt
                        endAt
                        HostId
                        HashTags {
                            id
                            name
                            createdAt
                            updatedAt
                            EventId
                        }
                    }
                }
            }
		`;
		const variables = {
			GuestId,
		};
		const context = {sub: AUTHORITY_TYPE_HOST, info: host};
		const root = null;

		// when
		let res = await gqlTester.graphql(query, root, context, variables);

		// to remove [Object: null prototype]
		res = JSON.parse(JSON.stringify(res));

		const {
			data: {init: result},
		} = res;

		// than
		const expected = {
			events: [
				{
					HashTags: [
						{
							EventId: hashtag1.EventId.toString(),
							createdAt: hashtag1.createdAt.getTime().toString(),
							id: hashtag1.id,
							name: hashtag1.name,
							updatedAt: hashtag1.updatedAt.getTime().toString(),
						},
					],
					HostId: event1.HostId.toString(),
					createdAt: event1.createdAt.getTime().toString(),
					endAt: event1.endAt.getTime().toString(),
					eventCode: event1.eventCode,
					eventName: event1.eventName,
					id: event1.id,
					moderationOption: event1.moderationOption,
					replyOption: event1.replyOption,
					startAt: event1.startAt.getTime().toString(),
					updatedAt: event1.updatedAt.getTime().toString(),
				}, {
					HashTags: [
						{
							EventId: hashtag2.EventId.toString(),
							createdAt: hashtag2.createdAt.getTime().toString(),
							id: hashtag2.id,
							name: hashtag2.name,
							updatedAt: hashtag2.updatedAt.getTime().toString(),
						},
					],
					HostId: event2.HostId.toString(),
					createdAt: event2.createdAt.getTime().toString(),
					endAt: event2.endAt.getTime().toString(),
					eventCode: event2.eventCode,
					eventName: event2.eventName,
					id: event2.id,
					moderationOption: event2.moderationOption,
					replyOption: event2.replyOption,
					startAt: event2.startAt.getTime().toString(),
					updatedAt: event2.updatedAt.getTime().toString(),
				},
			],
			host: {
				email: host.email,
				emailFeedBack: host.emailFeedBack,
				id: host.id,
				image: host.image,
				name: host.name,
				oauthId: host.oauthId,
			},
		};

		assert.deepStrictEqual(result, expected);
	});

	it("should be able to pass schema test 'query init'", async () => {
		const query = gql`
            query get_init {
                init {
                    host {
                        id
                        oauthId
                        name
                        email
                        emailFeedBack
                        image
                    }
                    events {
                        id
                        eventCode
                        eventName
                        moderationOption
                        replyOption
                        createdAt
                        updatedAt
                        startAt
                        endAt
                        HostId
                        HashTags {
                            id
                            name
                            createdAt
                            updatedAt
                            EventId
                        }
                    }
                }
            }
		`;

		const variables = {};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'init' by resolver", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});

		const HostId = host.id;
		const event1 = await createEvent({
			eventCode: "eventCode1",
			eventName: "eventname1",
			HostId,
		});
		const event2 = await createEvent({
			eventCode: "eventCode2",
			eventName: "eventname2",
			HostId,
		});
		const hashtag1 = await createHashtag({name: "one", EventId: event1.id});
		const hashtag2 = await createHashtag({name: "two", EventId: event2.id});

		const context = {sub: AUTHORITY_TYPE_HOST, info: host};
		const GuestId = null;

		// when
		const result = await hostpageResolvers.Query.init(
			null,
			{GuestId},
			context,
		);

		// than
		const expected = {
			events: [{...event1, HashTags: [hashtag1]}, {...event2, HashTags: [hashtag2]}],
			host,
		};

		assert.deepStrictEqual(result, expected);
	});

	it("should be able to query 'getEventOption'", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});
		const HostId = host.id;
		const event1 = await createEvent({
			eventCode: "eventCode1",
			eventName: "eventname1",
			HostId,
		});
		// gql input
		const query = gql`
            query get_init($EventId: ID!) {
                getEventOption(EventId: $EventId) {
                    moderationOption
                    replyOption
                }
            }
		`;
		const variables = {
			EventId: event1.id,
		};
		const context = null;
		const root = null;

		// when
		let res = await gqlTester.graphql(query, root, context, variables);

		// to remove [Object: null prototype]
		res = JSON.parse(JSON.stringify(res));

		const {
			data: {getEventOption: result},
		} = res;

		// than
		const expected = {
			moderationOption: event1.moderationOption,
			replyOption: event1.replyOption,
		};

		// assert(false);
		assert.deepStrictEqual(result, expected);
	});

	it("should be able to pass schema test 'query getEventOption'", async () => {
		const query = gql`
            query get_init($EventId: ID!) {
                getEventOption(EventId: $EventId) {
                    moderationOption
                    replyOption
                }
            }
		`;

		const variables = {
			EventId: 2,
		};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'getEventOption' by resolver", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});
		const HostId = host.id;
		const event1 = await createEvent({
			eventCode: "eventCode1",
			eventName: "eventname1",
			HostId,
		});

		// when
		const result = await hostpageResolvers.Query.getEventOption(null, {
			EventId: event1.id,
		});

		// than
		const expected = {
			moderationOption: event1.moderationOption,
			replyOption: event1.replyOption,
		};

		assert.deepStrictEqual(result, expected);
	});

	it("should be able to mutate 'createHashTags'", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});
		const HostId = host.id;
		const event1 = await createEvent({
			eventCode: "eventCode1",
			eventName: "eventname1",
			HostId,
		});

		const EventId = event1.id;
		const hashTagName = "tag1";
		const hashTags = [{name: hashTagName, EventId}];

		// gql input
		const query = gql`
            mutation Mutation($hashTags: [HashTagInput]!) {
                createHashTags(hashTags: $hashTags) {
                    id
                    name
                    createdAt
                    updatedAt
                    EventId
                }
            }
		`;
		const variables = {
			hashTags,
		};
		const context = {sub: AUTHORITY_TYPE_HOST, info: host};
		const root = null;

		// when
		await gqlTester.graphql(query, root, context, variables);

		// than
		const result = await models.Hashtag.findAll({
			where: {EventId},
			raw: true,
		});

		assert.equal(result.length, 1);
		const resultHashtag = result[0];

		assert.equal(resultHashtag.name, hashTagName);
		assert.equal(resultHashtag.EventId, EventId);
	});

	it("should be able to pass schema test 'mutate createHashTags'", async () => {
		const query = gql`
            mutation Mutation($hashTags: [HashTagInput]!) {
                createHashTags(hashTags: $hashTags) {
                    id
                    name
                    createdAt
                    updatedAt
                    EventId
                }
            }
		`;

		const variables = {
			hashTags: [{name: "name", EventId: 2}],
		};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'createHashTags' by resolver", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});
		const HostId = host.id;
		const event1 = await createEvent({
			eventCode: "eventCode1",
			eventName: "eventname1",
			HostId,
		});
		const context = {sub: AUTHORITY_TYPE_HOST, info: host};
		const EventId = event1.id;
		const hashTagName = "tag1";
		const hashTags = [{name: hashTagName, EventId}];

		// when
		await hostpageResolvers.Mutation.createHashTags(
			null,
			{
				hashTags,
			},
			context,
		);

		const result = await models.Hashtag.findAll({
			where: {EventId},
			raw: true,
		});

		assert.equal(result.length, 1);
		const resultHashtag = result[0];

		assert.equal(resultHashtag.name, hashTagName);
		assert.equal(resultHashtag.EventId, EventId);
	});

	it("should be able to mutate 'createEvent'", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});
		const HostId = host.id;
		const eventName = "eventName";
		const startAt = new Date().toISOString();
		const endAt = new Date().toISOString();

		const info = {
			HostId,
			eventName,
			startAt,
			endAt,
		};

		// gql input
		const query = gql`
            mutation Query($info: EventInfo!) {
                createEvent(info: $info) {
                    id
                    eventCode
                    eventName
                    moderationOption
                    replyOption
                    endAt
                    startAt
                    HostId
                }
            }
		`;
		const variables = {
			info,
		};
		const context = {sub: AUTHORITY_TYPE_HOST, info: host};
		const root = null;

		// when
		let gqlResult = await gqlTester.graphql(
			query,
			root,
			context,
			variables,
		);

		// to remove [Object: null prototype]
		gqlResult = JSON.parse(JSON.stringify(gqlResult));

		const {
			data: {createEvent: result},
		} = gqlResult;

		assert.equal(result.eventName, eventName);
		assert.equal(result.HostId, HostId);
		assert.equal(
			new Date(parseInt(result.startAt, 10)).toISOString(),
			startAt,
		);
		assert.equal(new Date(parseInt(result.endAt, 10)).toISOString(), endAt);
	});

	it("should be able to pass schema test 'mutate createEvent'", async () => {
		const query = gql`
            mutation Query($info: EventInfo!) {
                createEvent(info: $info) {
                    id
                    eventCode
                    eventName
                    moderationOption
                    replyOption
                    endAt
                    startAt
                    HostId
                }
            }
		`;

		const variables = {
			info: {
				HostId: 0,
				eventName: "eventName",
				startAt: "startAt",
				endAt: "endAt",
			},
		};

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'createEvent' by resolver", async () => {
		// given
		const host = await findOrCreateHostByOAuth({
			oauthId: "oauthId",
			email: "email",
			image: "image",
			name: "host name",
		});
		const HostId = host.id;
		const eventName = "eventName";
		const startAt = new Date().toISOString();
		const endAt = new Date().toISOString();

		const context = {sub: AUTHORITY_TYPE_HOST, info: host};

		const info = {
			HostId,
			eventName,
			startAt,
			endAt,
		};

		// when
		const result = await hostpageResolvers.Mutation.createEvent(
			null,
			{
				info,
			},
			context,
		);

		// than
		assert.equal(result.eventName, eventName);
		assert.equal(result.HostId, HostId);
		assert.equal(result.startAt.toISOString(), startAt);
		assert.equal(result.endAt.toISOString(), endAt);
	});
});
