import {deleteQuestionById} from "../../../DB/queries/question";

const questionCreateSocketHandler = async (data, emit) => {
	await deleteQuestionById(data.id);

	emit(data);
};

const eventName = "question/remove";

export default {
	eventName,
	handler: questionCreateSocketHandler,
};
