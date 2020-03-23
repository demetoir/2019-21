import {
	updateEveryState,
	updateQuestionById,
} from "../../../DB/queries/question";
import logger from "../../logger.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../../constants/socket.ioResponseState.js";
import {QUESTION_STATE_ACTIVE} from "../../../constants/questionState.js";

const moveQuestionSocketHandler = async (data, emit) => {
	try {
		const id = data.id;
		const state = data.to;

		if (id === "all") {
			await updateEveryState(QUESTION_STATE_ACTIVE, {state});
		} else {
			await updateQuestionById({id, state});
		}

		emit(data);
	} catch (e) {
		logger.error(e);

		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "question/move";

export default {
	eventName,
	handler: moveQuestionSocketHandler,
};
