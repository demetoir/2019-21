import React from "react";
import TitleContainer from "./Title/TitleContainer";
import QuestionContainer from "../Questions/QuestionContainer";
import {ModerationStyle, QuestionStyle} from "./ComponentsStyle";
import {filterStared} from "../../libs/utils";
import ColumnTypes from "./ColumnTypes.js";

function Column({type, state, data}) {
	const ColumnStyle =
		type === ColumnTypes.MODERATION ? ModerationStyle : QuestionStyle;

	return (
		<ColumnStyle state={state}>
			<TitleContainer type={type} state={state} data={data} />
			<QuestionContainer
				type={type}
				datas={filterStared(true, data)}
				containerType={"focus"}
			/>
			<QuestionContainer
				type={type}
				datas={filterStared(false, data)}
				containerType={"unFocus"}
			/>
		</ColumnStyle>
	);
}

export default Column;
