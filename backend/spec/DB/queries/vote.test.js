import assert from "assert";
import {before, beforeEach, describe, it} from "mocha";
import models from "../../../DB/models";
import {
	addAndDelete,
	addVote,
	deleteVoteBy,
	getCandidatesByGuestId,
	getVotersByCandidateList,
} from "../../../DB/queries/vote.js";
import {createCandidate} from "../../../DB/queries/candidate.js";
import {createGuest} from "../../../DB/queries/guest.js";

describe("vote DB query api", () => {
	const Vote = models.Vote;

	before(async () => {
		await models.sequelize.sync({force: true});
	});

	beforeEach(async () => {
		await models.Vote.destroy({where: {}, truncate: true});
	});

	it(`should be able to ${addVote.name}`, async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);

		const PollId = null;
		const content = "content";
		const number = 3;
		const candidate = await createCandidate({content, number, PollId});

		const GuestId = guest.id;
		const CandidateId = candidate.id;

		// when
		const vote = await addVote({GuestId, CandidateId});

		// than
		assert.equal(vote.CandidateId, CandidateId);
		assert.equal(vote.GuestId, GuestId);
	});

	it(`should be able to ${deleteVoteBy.name}`, async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);

		const PollId = null;
		const content = "content";
		const number = 3;
		const candidate = await createCandidate({content, number, PollId});

		const GuestId = guest.id;
		const CandidateId = candidate.id;

		await addVote({GuestId, CandidateId});

		// when
		const result = await deleteVoteBy({GuestId, CandidateId});

		// than
		assert.equal(result, 1);

		const expectAsNull = await Vote.findOne({
			where: {GuestId, CandidateId},
		});

		assert.equal(expectAsNull, null);
	});

	it(`should be able to ${addAndDelete.name}`, async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);

		const PollId = null;
		const content1 = "content1";
		const number1 = 3;
		const candidate1 = await createCandidate({
			content: content1,
			number: number1,
			PollId,
		});

		const content2 = "content2";
		const number2 = 3;
		const candidate2 = await createCandidate({
			content: content2,
			number: number2,
			PollId,
		});

		const GuestId = guest.id;
		const CandidateIdToDelete = candidate1.id;
		const CandidateIdToAdd = candidate2.id;

		await addVote({GuestId, CandidateId: CandidateIdToDelete});

		// when
		const result = await addAndDelete(
			GuestId,
			CandidateIdToAdd,
			CandidateIdToDelete,
		);

		// than
		assert.equal(result, 1);

		// expect create new vote
		const createdVote = (
			await Vote.findOne({
				where: {GuestId, CandidateId: CandidateIdToAdd},
			})
		).get({plain: true});

		assert.equal(createdVote.GuestId, GuestId);
		assert.equal(createdVote.CandidateId, CandidateIdToAdd);

		// expect delete old vote
		const deletedVote = await Vote.findOne({
			where: {GuestId, CandidateId: CandidateIdToDelete},
		});

		assert.equal(deletedVote, null);
	});

	it(`should be able to ${getCandidatesByGuestId.name}`, async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);

		const PollId = null;
		const content1 = "content1";
		const number1 = 3;
		const candidate1 = await createCandidate({
			content: content1,
			number: number1,
			PollId,
		});

		const GuestId = guest.id;
		const CandidateIdToDelete = candidate1.id;

		await addVote({GuestId, CandidateId: CandidateIdToDelete});

		// when
		const candidates = await getCandidatesByGuestId(
			[CandidateIdToDelete],
			GuestId,
		);

		// than
		const expected = [{CandidateId: CandidateIdToDelete}];

		assert.deepStrictEqual(candidates, expected);
	});

	it(`should be able to ${getVotersByCandidateList.name}`, async () => {
		// given
		const EventId = null;
		const guest = await createGuest(EventId);

		const PollId = null;
		const content1 = "content1";
		const number1 = 3;
		const candidate1 = await createCandidate({
			content: content1,
			number: number1,
			PollId,
		});

		const GuestId = guest.id;
		const CandidateIdToDelete = candidate1.id;

		await addVote({GuestId, CandidateId: CandidateIdToDelete});

		// when
		const voters = await getVotersByCandidateList([CandidateIdToDelete]);

		// than
		const expected = 1;

		assert.equal(voters, expected);
	});
});
