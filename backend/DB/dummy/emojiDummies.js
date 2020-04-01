import _ from "lodash";
import faker from "faker";
import config from "./initialConfig";
import {getQuestionById} from "../queries/question.js";

const {INIT_SEED} = config;

faker.seed(INIT_SEED);

export default async function makeEmojiDummy(number = 500) {
	const promiseList = _.range(number)
		.map(async () => {
			const QuestionId = faker.random.number({min: 1, max: 100});
			const GuestId = (await getQuestionById(QuestionId)).GuestId;
			const name = faker.random.arrayElement(["one", "two", "three", "four"]);
			const createdAt = faker.date.past(1);
			const updatedAt = createdAt;

			const res = await getQuestionById(QuestionId);

			return {
				QuestionId,
				GuestId,
				name,
				createdAt,
				updatedAt,
				EventId: res.EventId,
			};
		});

	return Promise.all(promiseList);
}
