import faker from "faker";
import _ from "lodash";
import config from "./initialConfig";
import models from "../models";
import {QUESTION_STATE_ACTIVE} from "../../constants/questionState.js";

const Guest = models.Guest;

export default async function makeQuestionDummy(number = 1000) {
	const {INIT_SEED} = config;

	faker.seed(INIT_SEED);

	const guests = (await Guest.findAll()).map(x => x.get({plain: true}));

	return _.range(number)
		.map(() => {
			const content = faker.lorem.sentence();
			const createdAt = faker.date.past(1);
			const updatedAt = createdAt;
			const state = QUESTION_STATE_ACTIVE;

			const guestIdx = faker.random.number({min: 0, max: guests.length - 1});
			const guest = guests[guestIdx];
			const GuestId = guest.id;
			const EventId = guest.EventId;
			const QuestionId = null;
			const isStared = false;
			const likeCount = 0;

			return {
				content,
				createdAt,
				state,
				updatedAt,
				EventId,
				GuestId,
				QuestionId,
				isStared,
				likeCount,
			};
		});
}
