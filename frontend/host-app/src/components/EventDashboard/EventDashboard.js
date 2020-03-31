import React, {useReducer, useState} from "react";
import Column from "./Column";
import {ColumnContainerStyle} from "./ComponentsStyle";
import QuestionsReducer from "../Questions/QuestionReducer";
import useQuestionSocketEventHandler from "../EventHandler/useQuestionSocketEventHandler";
import useModerationEventHandler from "../EventHandler/useModerationEventHandler";
import ColumnTypes from "./ColumnTypes.js";

function EventDashboard({data, option}) {
	const questions = data;

	const [questionsStore, dispatch] = useReducer(QuestionsReducer, {
		questions,
	});
	const [moderationState, setModeration] = useState(option.moderationOption);

	useQuestionSocketEventHandler(dispatch);
	useModerationEventHandler(setModeration);

	const common = {state: moderationState, data: questionsStore};

	return (
		<ColumnContainerStyle>
			<Column type={ColumnTypes.MODERATION} {...common} />
			<Column type={ColumnTypes.NEW_QUESTION} {...common} />
			<Column type={ColumnTypes.POPULAR_QUESTION} {...common} />
			<Column type={ColumnTypes.COMPLETE_QUESTION} {...common} />
			<Column type={ColumnTypes.POLL} data={{questions: []}} />
		</ColumnContainerStyle>
	);
}

export default EventDashboard;
