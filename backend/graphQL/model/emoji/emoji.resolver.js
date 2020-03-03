import {
	getEmojiCountByEventIdGroupByQuestionId,
	getEmojiPick,
} from "../../../DB/queries/emoji.js";

const emojisResolver = async (_, {EventId}) => {
	const res = await getEmojiCountByEventIdGroupByQuestionId({EventId});

	// convert type of createdAt from date to ISOString
	return res.map(x => ({...x, createdAt: x.createdAt.toISOString()}));
};

const emojiPickResolver = async (_, {EventId, GuestId}) =>
	getEmojiPick({EventId, GuestId});

// noinspection JSUnusedGlobalSymbols
export default {
	Query: {
		emojis: emojisResolver,
		emojiPicks: emojiPickResolver,
	},
};
