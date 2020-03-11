import {
	getGuestByEventId,
	getGuestByGuestSid,
} from "../../../DB/queries/guest.js";
import {getEventById} from "../../../DB/queries/event.js";

const guestResolver = async (_, {EventId}) => getGuestByEventId(EventId);

const guestInEventResolver = async (_, args, authority) => {
	if (authority.sub !== "guest") {
		throw Error("AuthenticationError in guestInEventResolver");
	}

	const guest = await getGuestByGuestSid(authority.info);
	const event = await getEventById(guest.EventId);

	return {event, guest};
};

// noinspection JSUnusedGlobalSymbols
export default {
	Query: {
		guests: guestResolver,
		guestInEvent: guestInEventResolver,
	},
};
