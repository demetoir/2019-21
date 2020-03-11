import {getPollsByEventId} from "../../../DB/queries/poll.js";
import {getCandidatesByPolls, setPollItems} from "./resolveHelper.js";

/**
 *
 * @param _
 * @param {int} EventId
 *
 * Yoga Resolver
 */
async function pollHostResolver(_, {EventId}) {
	/**
	 * getEventIdByEventCode(eventCode)
	 * getPollsByEventId(event.id)
	 * 해당 guestId가 어떻게 투표를 했는지에 대한 정보를 가져옴(active 여부와 상관없이)
	 *
	 */

	let polls = await getPollsByEventId(EventId);

	const candidates = await getCandidatesByPolls(polls);

	polls = await setPollItems(polls, candidates);
	return polls;
}

// noinspection JSUnusedGlobalSymbols
export default {
	Query: {
		pollHost: pollHostResolver,
	},
};
