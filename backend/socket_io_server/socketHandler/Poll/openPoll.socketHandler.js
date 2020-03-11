import {openPoll} from "../../../DB/queries/poll";
import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const openPollSocketHandler = async (data, emit) => {
	try {
		let status = SOCKET_IO_RESPONSE_STATE_OK;
		const {pollId} = data;
		const affectedRows = await openPoll(pollId);

		if (affectedRows !== 1) {
			logger.error(
				`Something wrong with poll/open: affected number of rows = ${affectedRows}`,
			);

			status = SOCKET_IO_RESPONSE_STATE_ERROR;
		}

		emit({status, pollId});
	} catch (e) {
		logger.error(e);

		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "poll/open";

// noinspection JSUnusedGlobalSymbols
export default {
	eventName,
	handler: openPollSocketHandler,
};
