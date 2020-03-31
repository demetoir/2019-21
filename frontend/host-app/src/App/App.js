import React, {useState} from "react";
import "./App.css";
import Header from "../components/Header/Header";
import AppBody from "./AppBody.js";
import {HostProvider} from "../libs/hostContext";
import {socketClient} from "../libs/socket.io-Client-wrapper";
import {compareCurrentDateToTarget} from "../libs/utils";
import {
	SOCKET_IO_EVENT_EVENT_INIT_OPTION,
	SOCKET_IO_EVENT_JOIN_ROOM,
	SOCKET_IO_EVENT_LEAVE_ROOM,
} from "../constants/socket.io-Events.js";

const isActiveEvent = event => {
	const eventDeadLine = new Date(parseInt(event.endAt, 10));

	return compareCurrentDateToTarget(eventDeadLine) > 0;
};

function App(props) {
	const {data} = props;
	const [events, setEvents] = useState(data.init.events);

	const activeEvents = events.filter(isActiveEvent);
	const activeEventsNum = activeEvents.length;

	if (activeEventsNum) {
		const eventId = activeEvents[0].id;

		socketClient.emit(SOCKET_IO_EVENT_LEAVE_ROOM);
		socketClient.emit(SOCKET_IO_EVENT_JOIN_ROOM, {room: eventId});
		socketClient.emit(SOCKET_IO_EVENT_EVENT_INIT_OPTION, eventId);
	}

	const hostProviderValue = {
		hostInfo: data.init.host,
		events: activeEvents,
		setEvents,
		allEvents: events,
	};

	return (
		<HostProvider value={hostProviderValue}>
			<div className="App">
				<Header />
				<AppBody eventNum={activeEventsNum} />
			</div>
		</HostProvider>
	);
}

export default App;
