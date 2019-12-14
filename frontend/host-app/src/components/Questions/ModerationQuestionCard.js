import React from "react";
import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import UserAvatar from "./UserAvata.js";
import {
	QuestionBody,
	QuestionButtons,
	QuestionHeader,
	QuestionInfo,
	QuestionMeta,
} from "./QuestionStyle";
import QuestionDate from "./QuestionDate";
import QuestionUserName from "./QuestionUserName";
import useStyles from "./useStyles";
import ApproveQuestionIconButton from "./ApproveQuestionIconButton.js";
import RejectQuestionIconButton from "./RejectQuestionIconButton.js";

function ModerationQuestionCard(props) {
	const classes = useStyles();

	return (
		<Card
			className={
				props.isStared ? classes.staredQuestion : classes.normalQuestion
			}
		>
			<CardContent>
				<QuestionHeader>
					<QuestionMeta>
						<UserAvatar {...props} />
						<QuestionInfo>
							<QuestionUserName {...props} />
							<QuestionDate {...props} />
						</QuestionInfo>
						<QuestionButtons>
							<ApproveQuestionIconButton {...props} />
							<RejectQuestionIconButton {...props} />
						</QuestionButtons>
					</QuestionMeta>
				</QuestionHeader>
				<QuestionBody>{props.content}</QuestionBody>
			</CardContent>
		</Card>
	);
}

export default ModerationQuestionCard;
