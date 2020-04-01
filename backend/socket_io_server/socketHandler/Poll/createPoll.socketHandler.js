import {createPollAndCandidates} from "../../../DB/queries/poll";
import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const createPollSocketHandler = async (data, emit) => {
	try {
		const {
			EventId,
			pollName,
			pollType,
			selectionType,
			allowDuplication,
			candidates,
		} = data;

		const poll = await createPollAndCandidates(
			EventId,
			pollName,
			pollType,
			selectionType,
			allowDuplication,
			candidates,
		);

		emit({status: SOCKET_IO_RESPONSE_STATE_OK, poll});
	} catch (e) {
		logger.error(e);
		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "poll/create";

export default {
	eventName,
	handler: createPollSocketHandler,
};
