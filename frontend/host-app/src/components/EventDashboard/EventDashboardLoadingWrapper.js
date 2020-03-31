import React, {useContext} from "react";
import useQueryQuestions from "../../libs/useQueryQuestions";
import {HostContext} from "../../libs/hostContext";
import SkeletonContent from "../Skeleton/SkeletonContent";
import EventDashboard from "./EventDashboard.js";

function EventDashboardLoadingWrapper(props) {
	const {value, index} = props;
	const {events} = useContext(HostContext);
	const {loading, error, data} = useQueryQuestions({
		variables: {EventId: events[0].id},
	});

	if (loading) return <SkeletonContent />;
	if (error) return <p>Error :(</p>;

	return (
		<>
			{value === index && (
				<EventDashboard data={data.newData} option={data.newOption} />
			)}
		</>
	);
}

export default EventDashboardLoadingWrapper;
