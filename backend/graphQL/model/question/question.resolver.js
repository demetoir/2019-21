import {getQuestionsByEventId} from "../../../DB/queries/question.js";

async function questionsResolver(_, {EventId}) {
	return getQuestionsByEventId(EventId);
}

export default {
	Query: {
		questions: questionsResolver,
	},
};
