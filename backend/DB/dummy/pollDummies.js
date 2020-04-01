import faker from "faker";
import config from "./initialConfig";
import {POLL_TYPE_N_ITEMS, POLL_TYPE_RATING} from "../../constants/pollType.js";
import {
	POLL_SELECTION_TYPE_DATE,
	POLL_SELECTION_TYPE_TEXT,
} from "../../constants/pollSelectionType.js";
import {POLL_STATE_CLOSED} from "../../constants/pollState.js";

const {INIT_SEED, EVENT_NUM, POLL_NUM} = config;

faker.seed(INIT_SEED);

export default function makePollDummy(number = POLL_NUM) {
	const bulkPoll = [];

	for (let i = 1; i <= number; ++i) {
		const pollName = faker.lorem.sentence();
		// 0: N지선다(text), 1: N지선다(date), 2: 별점매기기
		const type = i % 3;
		let pollType;
		let selectionType;

		if (type === 0) {
			pollType = POLL_TYPE_N_ITEMS;
			selectionType = POLL_SELECTION_TYPE_TEXT;
		} else if (type === 1) {
			pollType = POLL_TYPE_N_ITEMS;
			selectionType = POLL_SELECTION_TYPE_DATE;
		} else {
			pollType = POLL_TYPE_RATING;
			selectionType = Number(10).toString();
		}

		const allowDuplication = faker.random.boolean();
		const state = POLL_STATE_CLOSED;
		const createdAt = faker.date.past(1);
		const updatedAt = createdAt;
		const pollDate = createdAt;
		const EventId = faker.random.number({min: 1, max: EVENT_NUM});

		bulkPoll.push({
			pollName,
			pollType,
			selectionType,
			allowDuplication,
			state,
			createdAt,
			updatedAt,
			EventId,
			pollDate,
		});
	}

	return bulkPoll;
}
