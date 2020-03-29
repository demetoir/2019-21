import React, {useState} from "react";
import {useQuery} from "@apollo/react-hooks";
import "./App.css";
import Header from "../components/Header/Header";
import NavBar from "../components/NavBar/NavBar.js";
import {HostProvider} from "../libs/hostContext";
import {queryEventsByHost} from "../libs/gql";
import {socketClient} from "../libs/socket.io-Client-wrapper";
import AppSkeleton from "../components/Skeleton/AppSkeleton";
import config from "../config";
import {compareCurrentDateToTarget} from "../libs/utils";
import {
	SOCKET_IO_EVENT_EVENT_INIT_OPTION,
	SOCKET_IO_EVENT_JOIN_ROOM,
	SOCKET_IO_EVENT_LEAVE_ROOM,
} from "../constants/socket.io-Events.js";

const initialEvents = "";

const initialLoadEvents = (events, initialValue, dispatch, data) => {
	if (events === initialValue) {
		dispatch(data);
	}
};

function App() {
	const {data, loading, error} = useQuery(queryEventsByHost);
	const [events, setEvents] = useState(initialEvents);
	let activeEventsNum = 0;
	let eventsNum = 0;
	let activeEvents = [];

	if (loading) {
		return <AppSkeleton />;
	} else if (error) {
		window.location.href = config.inValidHostRedirectURL;
		return <div />;
	}
	initialLoadEvents(events, initialEvents, setEvents, data.init.events);

	const hostInfo = data.init.host;

	eventsNum = events.length;
	if (eventsNum) {
		activeEvents = events.filter(event => {
			const eventDeadLine = new Date(parseInt(event.endAt, 10));

			return compareCurrentDateToTarget(eventDeadLine) > 0;
		});
		activeEventsNum = activeEvents.length;
		if (activeEventsNum) {
			const eventId = activeEvents[0].id;

			socketClient.emit(SOCKET_IO_EVENT_LEAVE_ROOM);
			socketClient.emit(SOCKET_IO_EVENT_JOIN_ROOM, {room: eventId});
			socketClient.emit(SOCKET_IO_EVENT_EVENT_INIT_OPTION, eventId);
		}
	}

	return (
		<HostProvider
			value={{
				hostInfo,
				events: activeEvents,
				setEvents,
				allEvents: events,
			}}
		>
			<div className="App">
				<Header />
				<NavBar eventNum={activeEventsNum} />
			</div>
		</HostProvider>
	);
}

export default App;
