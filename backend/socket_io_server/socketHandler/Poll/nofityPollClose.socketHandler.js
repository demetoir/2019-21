import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const notifyPollCloseSocketHandler = async (data, emit) => {
	try {
		const {pollId} = data;

		emit({status: SOCKET_IO_RESPONSE_STATE_OK, pollId});
	} catch (e) {
		logger.error(e);
		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "poll/notify_close";

export default {
	eventName,
	handler: notifyPollCloseSocketHandler,
};
