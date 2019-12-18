import React from "react";
import styled from "styled-components";
import PollCandidate from "./PollCandidate.js";

const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	box-sizing: border-box;
	padding: 0.5rem;
	width: 100%;
`;

function PollNCandidate(props) {
	const {nItems, totalVoters, ...others} = props;

	return (
		<ColumnWrapper>
			{nItems.map(item => (
				<PollCandidate
					{...item}
					totalVoters={totalVoters}
					key={item.id}
					candidateId={item.id}
					{...others}
				/>
			))}
		</ColumnWrapper>
	);
}

export default PollNCandidate;
