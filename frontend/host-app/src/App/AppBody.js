import React from "react";
import EmptyContent from "../components/EventDashboard/EmptyContent.js";
import NavBar from "../components/NavBar/NavBar.js";
import useNavBar from "../components/NavBar/useNavBar.js";
import EventDashboardLoadingWrapper from "../components/EventDashboard/EventDashboardLoadingWrapper.js";

function AppBody(props) {
	const {eventNum} = props;
	const {tabIdx, onChange} = useNavBar();

	return (
		<>
			<NavBar onChange={onChange} tabIdx={tabIdx} />
			{eventNum ? (
				<EventDashboardLoadingWrapper value={tabIdx} index={0} />
			) : (
				<EmptyContent value={tabIdx} index={0} />
			)}
		</>
	);
}

export default AppBody;
