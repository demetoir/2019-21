/* eslint-disable array-element-newline */
import addEmoji from "./emoji/addEmoji.socketHandler.js";
import removeEmoji from "./emoji/removeEmoji.socketHandler.js";
import initOption from "./Event/initOption.socketHandler.js";
import like from "./like/like.socketHandler.js";
import unlike from "./like/unlike.socketHandler.js";
import closePoll from "./Poll/closePoll.socketHandler.js";
import createPoll from "./Poll/createPoll.socketHandler.js";
import notifyPollClose from "./Poll/nofityPollClose.socketHandler.js";
import notifyPollOpen from "./Poll/notifyPollOpen.socketHandler.js";
import openPoll from "./Poll/openPoll.socketHandler.js";
import createQuestion from "./Question/createQuestion.socketHandler.js";
import moveQuestion from "./Question/moveQuestion.socketHandler.js";
import updateQuestion from "./Question/updateQuestion.socketHandler.js";
import removeQuestion from "./Question/removeQuestion.socketHandler.js";
import toggleModeration from "./Question/toggleModeration.socketHandler.js";
import toggleStar from "./Question/toggleStar.socketHandler.js";
import rateOn from "./Vote/rateOn.socketHandler.js";
import rateOff from "./Vote/rateOff.socketHandler.js";
import voteOn from "./Vote/voteOn.socketHandler.js";
import voteOff from "./Vote/voteOff.socketHandler.js";
import hello from "./Hello.socketHandler.js";
import moveQuestions from "./Question/moveQuestions.socketHandler.js";

const socketHandlers = [
	addEmoji,
	removeEmoji,
	initOption,
	like,
	unlike,
	closePoll,
	openPoll,
	createPoll,
	notifyPollClose,
	notifyPollOpen,
	createQuestion,
	updateQuestion,
	removeQuestion,
	moveQuestion,
	toggleModeration,
	toggleStar,
	rateOn,
	rateOff,
	voteOn,
	voteOff,
	hello,
	moveQuestions,
];

export default socketHandlers;
