import assert from "assert";
import {before, beforeEach, describe, it} from "mocha";
import models from "../../../DB/models";
import {
	createBulkCandidates,
	createCandidate,
	getCandidatesByPollId,
} from "../../../DB/queries/candidate.js";

describe("candidate DB query api", () => {
	before(async () => {
		await models.sequelize.sync();
	});

	beforeEach(async () => {
		await models.Candidate.destroy({where: {}, truncate: true});
	});

	it("should be able to create candidate", async () => {
		// given
		const number = 1;
		const content = "content";
		const PollId = null;

		// when
		const candidate = await createCandidate({content, PollId, number});

		// than
		assert(candidate.id > 0);
		assert.equal(candidate.number, number);
		assert.equal(candidate.PollId, PollId);
		assert.equal(candidate.content, content);
	});

	it("should able to getCandidatesByPollId", async () => {
		// given
		const number = 1;
		const content = "content";
		const PollId = null;
		const candidate = await createCandidate({content, PollId, number});

		// when
		const result = await getCandidatesByPollId([PollId]);

		const expected = [candidate];

		// than
		assert.deepStrictEqual(result, expected);
	});

	it("should able to createBulkCandidates", async () => {
		const candidates = [
			{
				number: 1,
				content: "content1",
				PollId: null,
			}, {
				number: 2,
				content: "content2",
				PollId: null,
			},
		];

		const result = await createBulkCandidates(candidates);

		assert(result.length === 2);
		assert.equal(result[0].number, 1);
		assert.equal(result[0].content, "content1");
		assert.equal(result[0].PollId, null);

		assert.equal(result[1].content, "content2");
		assert.equal(result[1].number, 2);
		assert.equal(result[1].PollId, null);
	});
});
