import faker from "faker";
import {
	createEvent,
	getAllEvents,
	getEventById,
	getEventOptionByEventId,
	getEventsByHostId,
	updateEventById,
} from "../../../DB/queries/event.js";
import {
	createHashtag,
	getHashtagByEventIds,
} from "../../../DB/queries/hashtag.js";
import {AUTHORITY_TYPE_HOST} from "../../../constants/authorityTypes.js";

function verifySubjectHostJwt(jwtSub) {
	if (jwtSub !== AUTHORITY_TYPE_HOST) {
		throw new Error("AuthenticationError");
	}
}

function mappingHashTagsToEvents(hashTags, events, eventMap) {
	hashTags.forEach(hashTag => {
		eventMap.get(hashTag.EventId).push(hashTag);
	});
	events.forEach(event => {
		Object.assign(event, {HashTags: eventMap.get(event.id)});
	});

	return events;
}

async function generateEventCode() {
	let generatedEventCode = faker.random.alphaNumeric(4);
	const events = await getAllEvents();
	const alreadyExistEventCode = events.map(event => event.eventCode);

	while (true) {
		const isExist = alreadyExistEventCode.some(
			someCode => generateEventCode === someCode,
		);

		if (!isExist) {
			break;
		}
		generatedEventCode = faker.random.alphaNumeric(4);
	}
	return generatedEventCode;
}

const getEventOptionResolver = async (_, {EventId}) =>
	getEventOptionByEventId(EventId);

const initQueryResolver = async (_, {param}, authority) => {
	verifySubjectHostJwt(authority.sub);
	const host = authority.info;
	let events = await getEventsByHostId(host.id);

	const eventMap = new Map();
	const eventIdList = events.map(event => {
		eventMap.set(event.id, []);
		return event.id;
	});

	const hashTags = await getHashtagByEventIds(eventIdList);

	events = mappingHashTagsToEvents(hashTags, events, eventMap);

	return {events, host};
};

// todo: resolver의 return 값 및 해당 scheme의 return type refactoring 필요
const createHashTagsResolver = async (_, {hashTags}, authority) => {
	verifySubjectHostJwt(authority.sub);
	// todo fix to bulk insert
	for (const hashTag of hashTags) {
		// eslint-disable-next-line no-await-in-loop
		await createHashtag({
			name: hashTag.name,
			EventId: hashTag.EventId,
		});
	}
};

const createEventResolver = async (_, {info}, authority) => {
	verifySubjectHostJwt(authority.sub);
	const eventCode = await generateEventCode();
	const event = await createEvent({
		eventName: info.eventName,
		eventCode,
		HostId: authority.info.id,
		startAt: info.startAt,
		endAt: info.endAt,
	});

	return {...event};
};

const updateEventResolver = async (_, {event}, authority) => {
	verifySubjectHostJwt(authority.sub);
	await updateEventById({
		id: event.EventId,
		eventName: event.eventName,
		startAt: event.startAt,
		endAt: event.endAt,
	});

	return getEventById(event.EventId);
};

export default {
	Query: {
		init: initQueryResolver,
		getEventOption: getEventOptionResolver,
	},

	Mutation: {
		createHashTags: createHashTagsResolver,
		createEvent: createEventResolver,
		updateEvent: updateEventResolver,
	},
};
