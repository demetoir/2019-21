import sequelize from "sequelize";
import models from "../models";

// noinspection JSUnresolvedVariable
const Emoji = models.Emoji;

/**
 *
 * @param GuestId fk to guest table
 * @param QuestionId fk to question table
 * @param name name of emoji
 * @param EventId fk to event table
 * @returns {Promise<object>}
 */
export async function createEmoji({GuestId, QuestionId, name, EventId}) {
	const res = await Emoji.create({
		GuestId,
		QuestionId,
		name,
		EventId,
	});

	return res.get({plain: true});
}

/**
 *
 * @param id id of emoji
 * @returns {Promise<Number>}
 */
export async function deleteEmojiById(id) {
	return Emoji.destroy({
		where: {id},
	});
}

/**
 *
 * @param name name of emoji
 * @param GuestId fk to guest table
 * @param QuestionId fk to question table
 * @returns {Promise<Number>}
 */
export async function deleteEmojiBy({name, GuestId, QuestionId}) {
	return Emoji.destroy({where: {name, GuestId, QuestionId}});
}

/**
 *
 * @param name name of emoji
 * @param QuestionId fk to question table
 * @param GuestId fk to guest table
 * @returns {Promise<object[]>}
 */
export async function getDidIPicked({name, QuestionId, GuestId}) {
	const res = await Emoji.findAll({where: {name, QuestionId, GuestId}});

	return res.map(x => x.get({plain: true}));
}

/**
 *
 * @param name name of emoji
 * @param QuestionId fk to question table
 * @returns {Promise<number>}
 */
export async function getEmojiCountBy({name, QuestionId}) {
	return Emoji.count({where: {name, QuestionId}});
}

/**
 *
 * @param EventId fk to event table
 * @returns {Promise<object[]>}
 */
export async function getEmojiCountByEventIdGroupByQuestionId({EventId}) {
	const res = await Emoji.findAll({
		attributes: ["QuestionId", "name", [sequelize.fn("count", "id"), "count"], [sequelize.literal("MIN(createdAt)"), "createdAt"]],
		where: {EventId},
		group: ["QuestionId", "name"],
	});

	// raw: true 하는 방식은 timestamp가 정수형 String(ex "12312412412414") 타입으로 반환된다.
	// 따라서 await 한뒤 plain: true 방식으로 해야하 Date object type 으로 반환한ㄷ.
	return res.map(x => x.get({plain: true}));
}

/**
 *
 * @param GuestId fk to guest table
 * @param EventId fk to event table
 * @returns {Promise<object[]>}
 */
export async function getEmojiPick({GuestId, EventId}) {
	const res = await Emoji.findAll({
		where: {GuestId, EventId},
		attributes: ["name", "QuestionId"],
	});

	return res.map(x => x.get({plain: true}));
}
