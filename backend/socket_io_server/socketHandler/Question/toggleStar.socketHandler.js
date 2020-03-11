import {updateQuestionIsStared} from "../../../DB/queries/question";
import logger from "../../logger.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../../constants/socket.ioResponseState.js";

const toggleStarSocketHandler = async (data, emit) => {
	try {
		const from = data.from[0];
		const to = data.to[0];

		await updateQuestionIsStared({from: from.id, to: to.id});

		emit(to);
	} catch (e) {
		logger.error(e);

		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "question/toggleStar";

// noinspection JSUnusedGlobalSymbols
export default {
	eventName,
	handler: toggleStarSocketHandler,
};
