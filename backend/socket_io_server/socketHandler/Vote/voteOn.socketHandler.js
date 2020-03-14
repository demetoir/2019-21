import {swapVoteByGuestId, addVote} from "../../../DB/queries/vote";
import updateVoters from "./updateVoters";
import logger from "../../logger.js";
import {
	SOCKET_IO_RESPONSE_STATE_ERROR,
	SOCKET_IO_RESPONSE_STATE_OK,
} from "../../../constants/socket.ioResponseState.js";

const voteOnSocketHandler = async (data, emit) => {
	try {
		const {
			GuestId,
			CandidateId,
			allowDuplication,
			poll,
			candidateToDelete,
		} = data;

		let updateVotePromise;

		if (!allowDuplication && candidateToDelete) {
			updateVotePromise = swapVoteByGuestId(
				GuestId,
				CandidateId,
				candidateToDelete,
			);
		} else {
			updateVotePromise = addVote({GuestId, CandidateId});
		}

		const updateVotersPromise = updateVoters(poll);

		await Promise.all([updateVotePromise, updateVotersPromise]);

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
