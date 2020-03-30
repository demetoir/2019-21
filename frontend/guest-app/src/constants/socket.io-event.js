export const SOCKET_IO_EVENT_JOIN_ROOM = "joinRoom";
export const SOCKET_IO_EVENT_LEAVE_ROOM = "leaveRoom";
export const SOCKET_IO_EVENT_ERROR = "error";

export const SOCKET_IO_EVENT_CONNECTION = "connection";
export const SOCKET_IO_EVENT_CONNECT = "connect";
export const SOCKET_IO_EVENT_DISCONNECTING = "disconnecting";
export const SOCKET_IO_EVENT_DISCONNECT = "disconnect";
export const SOCKET_IO_EVENT_EVENT_INIT_OPTION = "event/initOption";
export const SOCKET_IO_EVENT_QUESTION_LIKE_CREATE = "questionLike/create";
export const SOCKET_IO_EVENT_QUESTION_LIKE_REMOVE = "questionLike/remove";

export const SOCKET_IO_EVENT_POLL_NOTIFY_OPEN = "poll/notify_open";
export const SOCKET_IO_EVENT_POLL_NOTIFY_CLOSE = "poll/notify_close";
export const SOCKET_IO_EVENT_VOTE_ON = "vote/on";
export const SOCKET_IO_EVENT_VOTE_OFF = "vote/off";
export const SOCKET_IO_EVENT_RATE_OFF = "rate/off";
export const SOCKET_IO_EVENT_RATE_ON = "rate/on";

export const REMOVE_QUESTION_LIKE = SOCKET_IO_EVENT_QUESTION_LIKE_REMOVE;
export const CREATE_QUESTION_LIKE = SOCKET_IO_EVENT_QUESTION_LIKE_CREATE;

export const SOCKET_IO_EVENT_QUESTION_CREATE = "question/create";
export const SOCKET_IO_EVENT_QUESTION_REMOVE = "question/remove";
export const SOCKET_IO_EVENT_QUESTION_UPDATE = "question/update";
export const SOCKET_IO_EVENT_QUESTION_MOVE = "question/move";

export const SOCKET_IO_EVENT_EMOJI_CREATE = "questionEmoji/create";
export 	const SOCKET_IO_EVENT_EMOJI_REMOVE = "questionEmoji/remove";
export const SOCKET_IO_EVENT_QUESTION_TOGGLE_STAR = "question/toggleStar";

export const SOCKET_IO_EVENT = {
	REMOVE_QUESTION_LIKE,
	CREATE_QUESTION_LIKE,
};
