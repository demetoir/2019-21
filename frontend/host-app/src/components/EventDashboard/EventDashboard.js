import React, {useReducer, useState} from "react";
import Column from "./Column";
import {ContentStyle} from "./ComponentsStyle";
import QuestionsReducer from "../Questions/QuestionReducer";
import useQuestionSocketEventHandler from "../EventHandler/useQuestionSocketEventHandler";
import useModerationEventHandler from "../EventHandler/useModerationEventHandler";

function EventDashboard({data, option}) {
	const questions = data;

	const [questionsStore, dispatch] = useReducer(QuestionsReducer, {
		questions,
	});
	const [moderationState, setModeration] = useState(option.moderationOption);

	useQuestionSocketEventHandler(dispatch);
	useModerationEventHandler(setModeration);

	const columnTypes = ["moderation", "newQuestion", "popularQuestion", "completeQuestion"];

	return (
		<ContentStyle>
			{columnTypes.map((e, i) => (
				<Column
					type={e}
					state={moderationState}
					data={questionsStore}
					key={i}
				/>
			))}
			<Column type="poll" data={{questions: []}}/>
		</ContentStyle>
	);
}

export default EventDashboard;
