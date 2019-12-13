import dotenv from "dotenv";
import express from "express";
import http from "http";
import io from "socket.io";
import configLoader from "./config/configLoader.js";
import logger from "./logger.js";
import authenticate from "./middleware/authenticate";
import IORoomManager from "./IORoomManager.js";
import {addBulkSocketIOHandlers, removeBulkSocketIOHandlers} from "./SocketIOBulkHandlerManager.js";
import socketHandlers from "./socketHandler";

dotenv.config();

const NAME_SPACE = "event";
const {port} = configLoader();
const app = express();
const httpServer = http.createServer(app).listen(port, () => {
	logger.info(
		`start socket.io server at ${port} with ${process.env.NODE_ENV} mode`
	);
});
const socketServer = io(httpServer);
const namedServer = socketServer.of(NAME_SPACE);

socketServer.use(authenticate());
namedServer.on("connection", async socket => {
	const id = socket.id;
	let bulkHandlers = null;

	logger.info(`id ${id} connected at /${NAME_SPACE}`);

	IORoomManager({
		bulkHandlers,
		socket,
		afterJoinRoom: (room, socket) => {
			bulkHandlers = addBulkSocketIOHandlers({
				handlers: socketHandlers,
				socket,
				server: namedServer,
				room,
			});
		},
		afterLeaveRoom: (room, socket) => {
			removeBulkSocketIOHandlers(bulkHandlers);
			bulkHandlers = null;
		},
	});

	socket.on("error", error =>
		logger.info(`error occur at socket id ${id} disconnected ${error}`)
	);
	socket.on("disconnecting", reason => {
		logger.info(`disconnecting at id ${id}, reason:${reason}`);
	});
	socket.on("disconnect", reason => {
		logger.info(`socket id ${id} disconnected reason:${reason}`);
	});
});

export default app;
