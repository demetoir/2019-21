import logger from "./logger.js";
import RoomSocket from "./RoomSocket.js";
import {SOCKET_IO_EVENT_JOIN_ROOM, SOCKET_IO_EVENT_LEAVE_ROOM} from "../constants/socket.io-Events.js";

const RoomSocketHelper = ({server, socket, handlerEventPair}) => {
	const id = socket.id;
	const currentRoom = null;
	const roomSocket = new RoomSocket({
		socket,
		server,
		handlerEventPair,
	});

	const onJoinRoom = async req => {
		const {room} = req;

		if (currentRoom) {
			logger.error(`id: ${id} already join in room`);
			return;
		}

		try {
			roomSocket.joinRoom(room);
		} catch (e) {
			logger.error(`error raised while join room ${e}`);
		}
	};

	const onLeaveRoom = async () => {
		// if (currentRoom === null) {
		// 	logger.error(`id: ${id} is not in room`);
		// 	return;
		// }

		try {
			roomSocket.leaveRoom();
		} catch (e) {
			logger.error(`error raised while leave room ${e}`);
		}
	};

	socket.on(SOCKET_IO_EVENT_JOIN_ROOM, onJoinRoom);
	socket.on(SOCKET_IO_EVENT_LEAVE_ROOM, onLeaveRoom);
};

export default RoomSocketHelper;
