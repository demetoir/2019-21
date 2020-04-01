import {updateQuestionById} from "../../../DB/queries/question.js";
import {updateGuestById} from "../../../DB/queries/guest.js";

const moveQuestionSocketHandler = async (data, emit) => {
	const updateQuestionByIdPromise = updateQuestionById(data);
	const updateGuestBYIdPromise = updateGuestById({
		id: data.GuestId,
		name: data.guestName,
		isAnonymous: data.isAnonymous,
	});

	await Promise.all([updateGuestBYIdPromise, updateQuestionByIdPromise]);

	emit(data);
};

const eventName = "question/update";

export default {
	eventName,
	handler: moveQuestionSocketHandler,
};
