import {getEventOptionByEventId} from "../../../DB/queries/event";
import eventCache from "../../EventCache";
import logger from "../../logger.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../../constants/socket.ioResponseState.js";

const initOptionSocketHandler = async (data, emit) => {
	try {
		const currentState = await getEventOptionByEventId(data); // dummy event Id

		await eventCache.set(data.eventId, currentState);
	} catch (e) {
		logger.error(e);

		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "event/initOption";

// noinspection JSUnusedGlobalSymbols
export default {
	eventName,
	handler: initOptionSocketHandler,
};
