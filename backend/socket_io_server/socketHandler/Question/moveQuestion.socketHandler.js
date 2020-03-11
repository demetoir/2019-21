import {
	updateEveryState,
	updateQuestionById,
} from "../../../DB/queries/question";
import logger from "../../logger.js";
import {QUESTION_STATE_ACTIVE} from "./createQuestion.socketHandler.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../socket.io-response-state.js";

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

// noinspection JSUnusedGlobalSymbols
export default {
	eventName,
	handler: moveQuestionSocketHandler,
};
