import React from "react";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";

const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
	align-items: center;
	justify-content: ${props => (props.left ? "flex-start" : "space-around")};
	width: 100%;
	min-height: 60px;
	padding: 0 2rem;
	box-sizing: border-box;
`;

// todo: prop type default prop 추가
// todo: 좀 더 명확한 이름
function Duplication({checked, onChange}) {
	return (
		<RowWrapper left>
			<Checkbox
				checked={checked}
				onChange={onChange}
			/>
            복수선택
		</RowWrapper>
	);
}

export default Duplication;