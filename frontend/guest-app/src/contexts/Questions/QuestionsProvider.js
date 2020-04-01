import React, {useEffect, useReducer} from "react";
import {useQuery} from "@apollo/react-hooks";
import {QUERY_INIT_QUESTIONS} from "../../apollo/gqlSchemes.js";
import QuestionsRepliesReducer from "../../reducers/QuestionsRepliesReducer.js";
import {useSocket} from "../../socket.io";
import buildQuestions from "../../apollo/asembleGetQuestionQuerys.js";
import QuestionsContext from "./QuestionsContext.js";
import useGlobalData from "../GlobalData/useGlobalData.js";
import {
	SOCKET_IO_EVENT_EMOJI_CREATE,
	SOCKET_IO_EVENT_EMOJI_REMOVE,
	SOCKET_IO_EVENT_QUESTION_CREATE,
	SOCKET_IO_EVENT_QUESTION_LIKE_CREATE,
	SOCKET_IO_EVENT_QUESTION_LIKE_REMOVE,
	SOCKET_IO_EVENT_QUESTION_MOVE,
	SOCKET_IO_EVENT_QUESTION_REMOVE,
	SOCKET_IO_EVENT_QUESTION_TOGGLE_STAR,
	SOCKET_IO_EVENT_QUESTION_UPDATE,
} from "../../constants/socket.io-event.js";

const QUESTION_STATE_ACTIVE = "active";

const QUESTION_ACTION_TYPE_LOAD = "load";
const QUESTION_ACTION_TYPE_ADD_NEW_QUESTION = "addNewQuestion";
const QUESTION_ACTION_TYPE_UPDATE_QUESTION = "updateQuestion";
const QUESTION_ACTION_TYPE_MOVE_QUESTION = "moveQuestion";
const QUESTION_ACTION_TYPE_TOGGLE_STAR_QUESTION = "toggleStarQuestion";
const QUESTION_ACTION_TYPE_ADD_EMOJI = "addQuestionEmoji";
const QUESTION_ACTION_TYPE_REMOVE_EMOJI = "removeQuestionEmoji";
const QUESTION_ACTION_TYPE_REMOVE_QUESTION = "removeQuestion";
const QUESTION_ACTION_TYPE_LIKE_QUESTION = "LikeQuestion";
const QUESTION_ACTION_TYPE_UNDO_LIKE = "undoLikeQuestion";

const useDataLoadEffect = (dispatch, data) => {
	useEffect(() => {
		if (data) {
			const buildData = buildQuestions(data);

			dispatch({type: QUESTION_ACTION_TYPE_LOAD, data: buildData});
		}
	}, [data, dispatch]);
};

const useSocketHandler = (dispatch, guestGlobal) => {
	useSocket(SOCKET_IO_EVENT_QUESTION_CREATE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_ADD_NEW_QUESTION, data: req});
	});

	useSocket(SOCKET_IO_EVENT_QUESTION_LIKE_CREATE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_LIKE_QUESTION, data: req});
	});

	useSocket(SOCKET_IO_EVENT_QUESTION_LIKE_REMOVE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_UNDO_LIKE, data: req});
	});

	useSocket(SOCKET_IO_EVENT_EMOJI_CREATE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_ADD_EMOJI, data: req});
	});

	useSocket(SOCKET_IO_EVENT_EMOJI_REMOVE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_REMOVE_EMOJI, data: req});
	});

	useSocket(SOCKET_IO_EVENT_QUESTION_REMOVE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_REMOVE_QUESTION, data: req});
	});

	useSocket(SOCKET_IO_EVENT_QUESTION_UPDATE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_UPDATE_QUESTION, data: req});
	});

	useSocket(SOCKET_IO_EVENT_QUESTION_MOVE, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_MOVE_QUESTION, data: req});
	});

	useSocket(SOCKET_IO_EVENT_QUESTION_TOGGLE_STAR, req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: QUESTION_ACTION_TYPE_TOGGLE_STAR_QUESTION, data: req});
	});

	useSocket("questions/move", req => {
		req.guestGlobal = guestGlobal;

		dispatch({type: "moveQuestions", data: req});
	});
};

function QuestionsProvider(props) {
	const {children} = props;
	const {event, guest} = useGlobalData();
	const {data, loading, error} = useQuery(QUERY_INIT_QUESTIONS, {
		variables: {EventId: event.id, GuestId: guest.id},
	});
	const [state, dispatch] = useReducer(QuestionsRepliesReducer, []);

	useDataLoadEffect(dispatch, data);
	useSocketHandler(dispatch, guest);

	const questions = state.filter(
		question =>
			question.QuestionId === null &&
			question.state === QUESTION_STATE_ACTIVE,
	);
	const replies = state.filter(question => question.QuestionId !== null);

	const value = {
		loading,
		error,
		questions,
		replies,
		dispatch,
	};

	return (
		<QuestionsContext.Provider value={value}>
			{children}
		</QuestionsContext.Provider>
	);
}

export default QuestionsProvider;
