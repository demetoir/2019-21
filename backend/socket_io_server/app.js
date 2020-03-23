import dotenv from "dotenv";
import express from "express";
import http from "http";
import io from "socket.io";
import configLoader from "./config/configLoader.js";
import logger from "./logger.js";
import authenticate from "./middleware/authenticate";
import RoomSocketHelper from "./RoomSocketHelper.js";
import socketHandlers from "./socketHandler";
import {
	SOCKET_IO_EVENT_CONNECTION,
	SOCKET_IO_EVENT_DISCONNECT,
	SOCKET_IO_EVENT_DISCONNECTING,
	SOCKET_IO_EVENT_ERROR,
} from "../constants/socket.io-Events.js";

dotenv.config();

const NAME_SPACE = "event";
const {port} = configLoader();
const app = express();
const httpServer = http.createServer(app).listen(port, () => {
	logger.info(
		`start socket.io server at ${port} with ${process.env.NODE_ENV} mode`,
	);
});
const socketServer = io(httpServer);
const namedServer = socketServer.of(NAME_SPACE);

socketServer.use(authenticate());
namedServer.on(SOCKET_IO_EVENT_CONNECTION, async socket => {
	const id = socket.id;

	logger.info(`id ${id} connected at /${NAME_SPACE}`);

	RoomSocketHelper({
		socket,
		server: namedServer,
		handlerEventPair: socketHandlers,
	});

	socket.on(SOCKET_IO_EVENT_ERROR, error =>
		logger.info(`error occur at socket id ${id} disconnected ${error}`),
	);
	socket.on(SOCKET_IO_EVENT_DISCONNECTING, reason => {
		logger.info(`disconnecting at id ${id}, reason:${reason}`);
	});
	socket.on(SOCKET_IO_EVENT_DISCONNECT, reason => {
		logger.info(`socket id ${id} disconnected reason:${reason}`);
	});
});

// noinspection JSUnusedGlobalSymbols
export default app;
