import {updateQuestionById} from "../../../DB/queries/question";
import logger from "../../logger.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../../constants/socket.ioResponseState.js";

const moveQuestionSocketHandler = async (data, emit) => {
	try {
		const {id, to} = data;

		await updateQuestionById({id, state: to});

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
