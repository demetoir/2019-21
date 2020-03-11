import {getQuestionsByEventId} from "../../../DB/queries/question.js";

async function questionsResolver(_, {EventId}) {
	return getQuestionsByEventId(EventId);
}

// noinspection JSUnusedGlobalSymbols
export default {
	Query: {
		questions: questionsResolver,
	},
};
