import {addAndDelete, addVote} from "../../../DB/queries/vote";
import updateVoters from "./updateVoters";
import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../socket.io-response-state.js";

const voteOnSocketHandler = async (data, emit) => {
	try {
		const {
			GuestId,
			CandidateId,
			allowDuplication,
			poll,
			candidateToDelete,
		} = data;

		if (!allowDuplication && candidateToDelete) {
			await addAndDelete(GuestId, CandidateId, candidateToDelete);
		} else {
			await addVote({GuestId, CandidateId});
		}

		await updateVoters(poll);

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

const eventName = "vote/on";

export default {
	eventName,
	handler: voteOnSocketHandler,
};
