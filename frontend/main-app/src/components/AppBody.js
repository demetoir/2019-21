import React from "react";
import styled from "styled-components";
import EventForm from "../components/EventForm.js";
import RecentEventList from "../components/RecentEventList.js";
import AppTitle from "./AppTitle.js";
import AppDescription from "./AppDescription.js";

const AppBodyStyle = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: auto;
	justify-content: center;
	align-items: center;
	h1 {
		margin-bottom: 1rem;
	}
`;

export default function AppBody() {
	return (
		<AppBodyStyle>
			<AppTitle/>
			<AppDescription/>
			<EventForm/>
			<RecentEventList/>
		</AppBodyStyle>
	);
}
