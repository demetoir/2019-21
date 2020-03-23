import {addVote} from "../../../DB/queries/vote";
import updateVoters from "./updateVoters";
import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const rateOnSocketHandler = async (data, emit) => {
	try {
		const {GuestId, CandidateId, poll, index} = data;

		await Promise.all([addVote({GuestId, CandidateId}), updateVoters(poll)]);

		emit({
			status: SOCKET_IO_RESPONSE_STATE_OK,
			GuestId,
			poll,
			index,
		});
	} catch (e) {
		logger.error(e);
		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "rate/on";

export default {
	eventName,
	handler: rateOnSocketHandler,
};
