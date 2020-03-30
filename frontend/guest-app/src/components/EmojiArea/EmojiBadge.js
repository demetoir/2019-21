import React from "react";
import styled, {css} from "styled-components";
import {Emoji} from "emoji-mart";

const colorGrey3 = "#dee2e6";
const colorBlue0 = "#e7f5ff";
const colorBlue5 = "#339af0";

const EmojiInstanceStyle = styled.div`
	display: inline-block;
	border: 1px solid ${colorGrey3};
	padding: 0 0.2rem 0;
	border-radius: 0.5rem;
	&:hover {
		cursor: pointer;
	}
	& + & {
		margin-left: 0.5rem;
	}
	span {
		margin-right: 0.2rem;
	}
	${props =>
		props.didIPick &&
		css`
			background-color: ${colorBlue0};
			border: 1px solid ${colorBlue5};
		`}
`;

function EmojiBadge(props) {
	const {name, count, didIPick, onClick} = props;

	return (
		<EmojiInstanceStyle
			didIPick={didIPick}
			onClick={() => onClick(name, didIPick)}
		>
			<Emoji emoji={name} size={16} />
			<span>{count}</span>
		</EmojiInstanceStyle>
	);
}

export default EmojiBadge;
