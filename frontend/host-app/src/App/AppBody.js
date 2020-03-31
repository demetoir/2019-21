import React from "react";
import EventDashboard from "../components/EventDashboard/EventDashboard.js";
import EmptyContent from "../components/EventDashboard/EmptyContent.js";
import NavBar from "../components/NavBar/NavBar.js";
import useNavBar from "../components/NavBar/useNavBar.js";

function AppBody(props) {
	const {eventNum} = props;
	const {tabIdx, onChange} = useNavBar();

	return (
		<>
			<NavBar onChange={onChange} tabIdx={tabIdx} />
			{eventNum ? (
				<EventDashboard value={tabIdx} index={0} />
			) : (
				<EmptyContent value={tabIdx} index={0} />
			)}
		</>
	);
}

export default AppBody;
