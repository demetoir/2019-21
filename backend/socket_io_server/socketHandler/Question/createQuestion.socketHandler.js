import {createQuestion} from "../../../DB/queries/question";
import {updateGuestById} from "../../../DB/queries/guest";
import eventCache from "../../EventCache.js";
import logger from "../../logger.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../../constants/socket.ioResponseState.js";
import {QUESTION_STATE_ACTIVE} from "../../../constants/questionState.js";

const QUESTION_STATE_MODERATION = "moderation";

function toQuestionRequestDTO({
	EventId,
	GuestId,
	guestName,
	content,
	emojis = [],
	isAnonymous = false,
	createdAt = new Date().getTime()
		.toString(),
	isShowEditButton = true,
	didILike = false,
	likeCount = 0,
	state = QUESTION_STATE_ACTIVE,
	QuestionId = null,
	isStared = false,
}) {
	return {
		guestName,
		EventId,
		GuestId,
		emojis,
		createdAt,
		content,
		isShowEditButton,
		isAnonymous,
		didILike,
		likeCount,
		state,
		QuestionId,
		isStared,
	};
}

const createQuestionSocketHandler = async (data, emit, socket) => {
	try {
		const questionRequestDTO = toQuestionRequestDTO(data);
		const {
			EventId,
			content,
			GuestId,
			guestName,
			isAnonymous,
			QuestionId,
		} = questionRequestDTO;

		logger.debug(data);

		const event = await eventCache.get(EventId);
		const isModerationMode = event.moderationOption;
		const responseDTO = questionRequestDTO;

		if (isModerationMode) {
			responseDTO.state = QUESTION_STATE_MODERATION;
		}

		const createQuestionPromise = createQuestion({
			EventId,
			content,
			GuestId,
			QuestionId,
			state: responseDTO.state,
		});
		const updateGuestByIdPromise = updateGuestById({
			id: GuestId,
			name: guestName,
			isAnonymous,
		});
		const [question] = await Promise.all([createQuestionPromise, updateGuestByIdPromise]);

		responseDTO.id = question.id;

		// todo 성능 개선: moderation기능이 on인경우 host에만 send 하도록 수정
		emit(responseDTO);
	} catch (e) {
		logger.error(`${e.toString()}\n${e.stack}`);
		socket.send({status: SOCKET_IO_RESPONSE_STATE_ERROR, error: e});
	}
};

const eventName = "question/create";

export default {
	eventName,
	handler: createQuestionSocketHandler,
};
