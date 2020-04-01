import React from "react";
import Rating from "@material-ui/lab/Rating";
import styled from "styled-components";
import ActiveRating from "./ActiveRating";
import {
	POLL_STATE_CLOSED,
	POLL_STATE_RUNNING,
} from "../../constants/poll_state.js";

const colorGray3 = "#dee2e6";
const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	flex: 1;
	width: 80%;
	padding: 1rem;
	box-sizing: border-box;
	border: 1px solid ${colorGray3};
`;

function RatingItem({
	id,
	state,
	rated,
	ratingValue,
	selectionType,
	onChange,
	onCancelRating,
}) {
	return (
		<ColumnWrapper>
			{state === POLL_STATE_RUNNING && (
				<ActiveRating
					id={id}
					rated={rated}
					ratingValue={ratingValue}
					max={parseInt(selectionType, 10)}
					state={state}
					onChange={onChange}
					onCancelRating={onCancelRating}
				/>
			)}
			{state === POLL_STATE_CLOSED && (
				<>
					<div>{rated === true && "투표했음"}</div>
					<div>{rated === false && "투표 안했음"}</div>
					<Rating
						readOnly
						value={ratingValue}
						max={parseInt(selectionType, 10)}
					/>
				</>
			)}
		</ColumnWrapper>
	);
}

export default RatingItem;
