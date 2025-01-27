import React, {useRef} from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ReplyInput from "./ReplyInput.js";
import {socketClient} from "../../socket.io";
import useGlobalData from "../../contexts/GlobalData/useGlobalData.js";
import {SOCKET_IO_EVENT_QUESTION_CREATE} from "../../constants/socket.io-event.js";

const toNewReplyDTO = ({
	EventId,
	GuestId,
	guestName,
	content,
	QuestionId,
}) => ({
	guestName,
	EventId,
	GuestId,
	content,
	QuestionId,
	isAnonymous: guestName.length === 0,
});

function ReplyInputContainer(props) {
	const {id} = props;
	const {event, guest} = useGlobalData();
	const userNameRef = useRef(null);
	const questionRef = useRef(null);
	const onConfirmNewReply = reply => {
		if (reply.trim() === "") {
			return;
		}

		socketClient.emit(
			SOCKET_IO_EVENT_QUESTION_CREATE,
			toNewReplyDTO({
				guestName: userNameRef.current.value,
				EventId: event.id,
				GuestId: guest.id,
				content: questionRef.current.value,
				QuestionId: id,
			}),
		);
	};

	return (
		<Card style={{margin: "0.5rem"}}>
			<CardContent style={{paddingTop: "1rem", paddingBottom: "0"}}>
				<ReplyInput
					onConfirm={onConfirmNewReply}
					confirmButtonText={"댓글달기"}
					userNameRef={userNameRef}
					questionRef={questionRef}
				/>
			</CardContent>
		</Card>
	);
}

ReplyInputContainer.propTypes = {
	id: PropTypes.string,
};

export default ReplyInputContainer;
