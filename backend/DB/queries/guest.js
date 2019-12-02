import models from "../models";
import uuidv1 from "uuid/v1";

async function createGuest(name, eventId) {
	const result = await models.Guest.create(
		{name, EventId: eventId, guestSid: uuidv1()},
		{default: {isAnonymous: 0}},
	);

	const status = !!result;

	return status;
}

export {createGuest};