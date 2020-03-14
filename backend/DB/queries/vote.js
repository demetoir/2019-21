import Sequelize from "sequelize";
import models from "../models";
import logger from "../logger.js";

const sequelize = models.sequelize;
// noinspection JSUnresolvedVariable
const Vote = models.Vote;
const Op = Sequelize.Op;


/**
 *
 * @param GuestId {number|null}
 * @param CandidateId {number|null}
 * @return {Promise<object>}
 */
export async function addVote({GuestId, CandidateId}) {
	const result = await Vote.create({GuestId, CandidateId});

	return result.get({plain: true});
}

/**
 *
 * @param GuestId {number|null}
 * @param CandidateId {number|null}
 * @return {Promise<number>} affected rows number
 */
export async function deleteVoteBy({GuestId, CandidateId}) {
	return Vote.destroy({where: {GuestId, CandidateId}});
}

/**
 *
 * @param guestId {number|null}
 * @param candidateToAdd {number|null}
 * @param candidateToDelete {number|null}
 * @return {Promise<number>} affected rows
 */
export async function addAndDelete(guestId, candidateToAdd, candidateToDelete) {
	const GuestId = guestId;
	let CandidateId = candidateToAdd;
	let transaction;
	let rows;

	try {
		// get transaction
		transaction = await sequelize.transaction();

		// step 1
		await Vote.create(
			{
				GuestId,
				CandidateId,
			},
			{transaction},
		);

		// step 2
		CandidateId = candidateToDelete;
		rows = await Vote.destroy({
			where: {
				GuestId,
				CandidateId,
			},
			transaction,
		});

		// commit
		await transaction.commit();
	} catch (err) {
		// Rollback transaction only if the transaction object is defined
		if (transaction) {
			await transaction.rollback();
		}

		logger.error("Transaction rollback", err);
	}

	return rows;
}

/**
 *
 * @param candidateList {number[]}
 * @param guestId {number|null}
 * @return {Promise<object[]>}
 */
export async function getCandidatesByGuestId(candidateList, guestId) {
	const result = await Vote.findAll({
		where: {
			[Op.and]: [
				{GuestId: guestId}, {
					CandidateId: {
						[Op.or]: candidateList,
					},
				},
			],
		},
		attributes: ["CandidateId"],
	});

	return result.map(x => x.get({plain: true}));
}

/**
 *
 * @param candidateList {number[]}
 * @return {Promise<number>}
 */
export async function getVotersByCandidateList(candidateList) {
	return Vote.count({
		where: {
			CandidateId: {
				[Op.or]: candidateList,
			},
		},
		distinct: true,
		col: "GuestId",
	});
}
