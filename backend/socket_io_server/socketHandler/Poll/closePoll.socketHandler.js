import {closePoll} from "../../../DB/queries/poll";
import logger from "../../logger.js";

const closePollSocketHandler = async (data, emit) => {
	try {
		let status = "ok";
		const {pollId} = data;

		const affectedRows = await closePoll(pollId);

		if (affectedRows !== 1) {
			logger.error(
				`Something wrong with poll/close: affected number of rows = ${affectedRows}`,
			);

			status = "error";
		}

		emit({status, pollId});
	} catch (e) {
		logger.error(e);

		emit({status: "error", e});
	}
};

const eventName = "poll/close";

// noinspection JSUnusedGlobalSymbols
export default {
	eventName,
	handler: closePollSocketHandler,
};
