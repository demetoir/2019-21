import assert from "assert";
import {before, beforeEach, describe, it} from "mocha";
import models from "../../../DB/models";
import {
	closePoll,
	createPoll,
	getPollsByEventId,
	openPoll,
	POLL_STATE_CLOSED,
	POLL_STATE_RUNNING,
} from "../../../DB/queries/poll.js";

describe("poll query api", () => {
	const Poll = models.Poll;

	before(async () => {
		await models.sequelize.sync();
	});

	beforeEach(async () => {
		await models.Poll.destroy({where: {}, truncate: true});
	});

	it("should able to getPollsByEventId", async () => {
		// given

		const EventId = null;
		const pollName = "poll name";
		const pollType = "poll type";
		const selectionType = "selection type";
		const allowDuplication = false;
		const pollDate = new Date();
		const state = "state";

		const poll = (
			await Poll.create({
				EventId,
				pollName,
				pollType,
				selectionType,
				allowDuplication,
				state,
				pollDate,
			})
		).get({plain: true});

		// when
		const res = await getPollsByEventId(EventId);

		// than
		assert(res.length > 0);
		assert.deepStrictEqual(res[0], poll);
	});

	it("should able to openPoll", async () => {
		const EventId = null;
		const pollName = "poll name";
		const pollType = "nItem";
		const selectionType = "sim";
		const allowDuplication = false;
		const state = "standby";
		const pollDate = new Date();

		const poll = await Poll.create({
			EventId,
			pollName,
			pollType,
			selectionType,
			allowDuplication,
			state,
			pollDate,
		});

		// when
		const result = await openPoll(poll.id);

		// than
		assert.equal(result, 1);
		const real = await Poll.findOne({where: {id: poll.id}});

		assert.equal(real.state, POLL_STATE_RUNNING);
	});

	it("should able to closePoll", async () => {
		const EventId = null;
		const pollName = "poll name";
		const pollType = "nItem";
		const selectionType = "sim";
		const allowDuplication = false;
		const state = "standby";
		const pollDate = new Date();

		const poll = await Poll.create({
			EventId,
			pollName,
			pollType,
			selectionType,
			allowDuplication,
			state,
			pollDate,
		});

		// when
		const result = await closePoll(poll.id);

		// than
		assert.equal(result, 1);
		const real = await Poll.findOne({where: {id: poll.id}});

		assert.equal(real.state, POLL_STATE_CLOSED);
	});

	it("should able to create poll", async () => {
		// given
		const EventId = null;
		const pollName = "poll name";
		const pollType = "poll type";
		const selectionType = "selection type";
		const allowDuplication = false;

		// when
		const poll = await createPoll({
			EventId,
			pollName,
			pollType,
			selectionType,
			allowDuplication,
		});

		// than
		assert(poll.id > 0);
		assert.equal(poll.EventId, EventId);
		assert.equal(poll.pollName, pollName);
		assert.equal(poll.pollType, pollType);
		assert.equal(poll.selectionType, selectionType);
		assert.equal(poll.allowDuplication, allowDuplication);
	});
});
