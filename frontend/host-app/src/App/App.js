import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import Header from "../components/Header";
import Nav from "../components/Nav";
import Content from "../components/Content";
import NewPollModal from "../components/Poll/NewPollModal";
import { HostProvider } from "../libs/hostContext";
import { getEventsByHost } from "../libs/gql";
import EmptyContent from "../components/EmptyContent";
import {socketClient} from "../libs/socket.io-Client-wrapper";

function App() {
	const modal = false;
	const { data, loading, error } = useQuery(getEventsByHost());
	const [events, setEvents] = useState("");

	if (loading) {
		return <p>loading...</p>;
	} else if (error) {
		return <p>error-page...</p>;
	} else {
		if (events === "") setEvents(data.init.events);
		const hostInfo = data.init.host;
		
		socketClient.emit("event/initOption", 2); //dummy Event Id:2
		const eventNum = events.length;
		return (
			<HostProvider value={{ hostInfo, events, setEvents }}>
				<div className="App">
					<Header />
					<Nav />
					{modal && <NewPollModal />}
					{eventNum ? <Content event={event} /> : <EmptyContent />}
				</div>
			</HostProvider>
		);
	}
}

export default App;
