import assert from "assert";
import EasyGraphQLTester from "easygraphql-tester";
import {after, before, beforeEach, describe, it} from "mocha";
import guestResolvers from "../../graphQL/model/guest/guest.resolver.js";
import SequelizeTestHelper from "../testHelper/SequelizeTestHelper.js";
import typeDefs from "../../graphQL/typeDefs.js";
import resolvers from "../../graphQL/resolvers.js";
import models from "../../DB/models";
import {createGuest} from "../../DB/queries/guest.js";
import {createEvent} from "../../DB/queries/event.js";

describe("graphql yoga guest model", () => {
	const sequelizeMock = new SequelizeTestHelper();

	let gqlTester = null;

	before(async () => {
		await Promise.all([sequelizeMock.setup()]);

		gqlTester = new EasyGraphQLTester(typeDefs, resolvers);
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
	});

	it("should able to query 'guests'", async () => {
		const HostId = null;
		const eventName = "eventName";
		const eventCode = "eventCord";
		const event = await createEvent({eventCode, eventName, HostId});

		const EventId = event.id;
		const guest = await createGuest(EventId);

		const root = null;
		const context = null;
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
			EventId,
		};

		let res = await gqlTester.graphql(query, root, context, variables);

		// to remove [Object: null prototype]
		res = JSON.parse(JSON.stringify(res));

		const {
			data: {guests: realGuests},
		} = res;

		const expected = [
			{
				company: null,
				email: null,
				id: guest.id.toString(),
				isAnonymous: guest.isAnonymous,
				name: guest.name,
			},
		];

		assert.deepStrictEqual(realGuests, expected);
	});

	it("should be able to pass schema test 'query guests'", async () => {
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

		await gqlTester.test(true, query, variables);
	});

	it("should be able to resolve 'guests' by resolver", async () => {
		// given
		const HostId = null;
		const eventName = "eventName";
		const eventCode = "eventCord";
		const event = await createEvent({eventCode, eventName, HostId});

		const EventId = event.id;
		const guest = await createGuest(EventId);

		// when
		const real = await guestResolvers.Query.guests(null, {EventId});

		// than
		const expected = [guest];

		assert.deepStrictEqual(real, expected);
	});
});
