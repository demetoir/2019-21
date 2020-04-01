import {createEmoji} from "../../../DB/queries/emoji.js";

const addEmojiSocketHandler = async (data, emit) => {
	const {GuestId, name, EventId, QuestionId} = data;
	const res = await createEmoji({GuestId, name, EventId, QuestionId});

	emit(res);
};

const eventName = "questionEmoji/create";

export default {
	eventName,
	handler: addEmojiSocketHandler,
};
