import {updateQuestionsByStateAndEventId} from "../../../DB/queries/question.js";
import logger from "../../logger.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../../constants/socket.ioResponseState.js";

const moveQuestionsSocketHandler = async (data, emit) => {
	try {
		const {to, from, EventId} = data;

		await updateQuestionsByStateAndEventId({from, to, EventId});

		emit(data);
	} catch (e) {
		logger.error(e);

		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

export default {
	eventName: "questions/move",
	handler: moveQuestionsSocketHandler,
};
