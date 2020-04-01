import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {Icon} from "@material-ui/core";
import useStyles from "./useButtonStyles.js";
import {handleMoveQuestions} from "../../EventEmiter/QuestionSocketEventEmiter.js";

function CompleteAllQuestionButton({data}) {
	const classes = useStyles();

	// todo extract constant
	return (
		<>
			<Tooltip title="모든 질문 완료">
				<Icon
					className={classes.completeAllButton}
					onClick={() => {
						// todo fix me
						const EventId = data.questions[0].EventId;

						handleMoveQuestions(
							EventId,
							"active",
							"completeQuestion",
						);
					}}
				>
					launch
				</Icon>
			</Tooltip>
		</>
	);
}

export default CompleteAllQuestionButton;
