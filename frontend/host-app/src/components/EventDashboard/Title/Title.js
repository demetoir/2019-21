import React, {useContext} from "react";
import {RightSide, TitleBox, TitleStyle} from "../ComponentsStyle";
import CompleteAllQuestionButton from "../Buttons/CompleteAllQuestionButton";
import TitleBadge from "./TitleBadge";
import {HostContext} from "../../../libs/hostContext";
import titleNameMap from "./titleNameMap";
import ModerationButton from "../Buttons/ModerationButton";
import ColumnTypes from "../ColumnTypes.js";

const isActive = type =>
	type === ColumnTypes.NEW_QUESTION || type === ColumnTypes.POPULAR_QUESTION;
const isModeration = type => type === ColumnTypes.MODERATION;

function Title({data, type, state}) {
	const {events} = useContext(HostContext);
	const eventId = events[0].id;

	return (
		<>
			<TitleBox>
				<TitleBadge dataLength={data.questions.length} type={type} />
				<TitleStyle>{titleNameMap[type]}</TitleStyle>
				<RightSide>
					{isModeration(type) && (
						<ModerationButton state={state} eventId={eventId} />
					)}
					{isActive(type) && (
						<CompleteAllQuestionButton data={data} />
					)}
				</RightSide>
			</TitleBox>
		</>
	);
}

export default Title;
