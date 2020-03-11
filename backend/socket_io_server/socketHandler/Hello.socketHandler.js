import {SOCKET_IO_RESPONSE_STATE_ERROR} from "./socket.io-response-state.js";

function verySlowJob() {
	return new Promise(resolve =>
		setTimeout(() => {
			resolve();
		}, 1000),
	);
}

const helloHandler = async (data, emit) => {
	try {
		// console.log(data);

		await verySlowJob();

		// console.log("delayed");
		emit(data);
	} catch (e) {
		// console.log(e);
		emit({status: SOCKET_IO_RESPONSE_STATE_ERROR, e});
	}
};

const eventName = "hello";

// noinspection JSUnusedGlobalSymbols
export default {
	eventName,
	handler: helloHandler,
};
