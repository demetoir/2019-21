import {deleteVoteBy} from "../../../DB/queries/vote";
import updateVoters from "./updateVoters";
import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const voteOffSocketHandler = async (data, emit) => {
	try {
		const {GuestId, CandidateId, poll} = data;

		await Promise.all([deleteVoteBy({GuestId, CandidateId}), updateVoters(poll)]);

		emit({
			status: SOCKET_IO_RESPONSE_STATE_OK,
			GuestId,
			poll,
		});
	} catch (e) {
		logger.error(e);
		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "vote/off";

export default {
	eventName,
	handler: voteOffSocketHandler,
};
