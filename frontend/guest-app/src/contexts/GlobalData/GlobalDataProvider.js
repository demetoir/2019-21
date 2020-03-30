import React from "react";
import {useQuery} from "@apollo/react-hooks";
import {GET_GUEST_APP_GLOBAL_DATA} from "../../apollo/gqlSchemes.js";
import TopProgressBar from "../../components/atoms/TopProcessBar.js";
import config from "../../config";
import {createSocketIOClient, SocketClientProvider} from "../../socket.io";
import GlobalDataContext from "./GlobalDataContext.js";
import {SOCKET_IO_EVENT_CONNECT, SOCKET_IO_EVENT_JOIN_ROOM} from "../../constants/socket.io-event.js";

const namespace = "event";

function GlobalDataProvider(props) {
	const {data, loading, error} = useQuery(GET_GUEST_APP_GLOBAL_DATA);

	if (loading) {
		return <TopProgressBar/>;
	}

	if (error) {
		window.location.href = config.inValidGuestRedirectURL;
		return <div/>;
	}

	const {event, guest} = data.guestInEvent;
	const globalData = {event, guest};

	const client = createSocketIOClient({
		host: config.socketIOHost,
		port: config.socketIOPort,
		namespace,
		room: event.id,
	});

	client.on(SOCKET_IO_EVENT_CONNECT, () => {
		client.emit(SOCKET_IO_EVENT_JOIN_ROOM, {room: event.id});
	});

	return (
		<GlobalDataContext.Provider value={globalData}>
			<SocketClientProvider client={client}>
				{props.children}
			</SocketClientProvider>
		</GlobalDataContext.Provider>
	);
}

export default GlobalDataProvider;
