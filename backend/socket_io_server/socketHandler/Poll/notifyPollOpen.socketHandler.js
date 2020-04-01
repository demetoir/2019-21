import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const notifyPollOpenSocketHandler = async (data, emit) => {
	try {
		const {poll} = data;

		emit({status: SOCKET_IO_RESPONSE_STATE_OK, poll});
	} catch (e) {
		logger.error(e);
		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "poll/notify_open";

export default {
	eventName,
	handler: notifyPollOpenSocketHandler,
};
