import React from "react";
import styled from "styled-components";
import Title from "./Title";

const ColumnStyle = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: auto;
	justify-content: flex-start;
	align-items: center;
	border-radius: 8px;
	background-color: #f1f3f5;
	border: 1px solid #e9ecef;
	height: 100%;
	box-sizing: border-box;
	& + & {
		margin-left: 8px;
	}
`;

function Column({type, state, stateHandler, badgeState}) {
	return (
		<ColumnStyle>
			<Title type={type} state={state} stateHandler={stateHandler} badgeState={badgeState}/>
		</ColumnStyle>
	);
}

export default Column;