import React from "react";
import Button from "@material-ui/core/Button";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import useCommonModal from "../CommonComponent/CommonModal/useCommonModal.js";
import UndoLikeConfirmModal from "./LikeUndoModal.js";
import {socketClient} from "../../socket.io";
import useGlobalData from "../../contexts/GlobalData/useGlobalData.js";
import {
	SOCKET_IO_EVENT,
} from "../../constants/socket.io-event.js";

function LikeButtonAtom({isLikeClicked, onLikeButtonClicked, likeCount}) {
	return (
		<Button
			variant={isLikeClicked ? "contained" : "outlined"}
			color={isLikeClicked ? "primary" : "default"}
			onClick={onLikeButtonClicked}
			style={{
				width: "5rem",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<ThumbUpIcon />
			{likeCount}
		</Button>
	);
}

function emitQuestionLikeCreate(GuestId, QuestionId) {
	socketClient.emit(SOCKET_IO_EVENT.CREATE_QUESTION_LIKE, {
		GuestId,
		QuestionId,
	});
}

function emitQuestionLikeRemove(GuestId, QuestionId) {
	socketClient.emit(SOCKET_IO_EVENT.REMOVE_QUESTION_LIKE, {
		GuestId,
		QuestionId,
	});
}

function LikeButton(props) {
	const {likeCount, didILike, id} = props;
	const {guest} = useGlobalData();
	const modalState = useCommonModal();
	const onLikeButtonClicked = () => {
		if (didILike) {
			modalState.openModal();
		} else {
			emitQuestionLikeCreate(guest.id, id);
		}
	};

	const onCancelClick = () => {
		modalState.closeModal();
	};
	const onConfirmClick = () => {
		emitQuestionLikeRemove(guest.id, id);
		modalState.closeModal();
	};

	return (
		<>
			<LikeButtonAtom
				onLikeButtonClicked={onLikeButtonClicked}
				likeCount={likeCount}
				isLikeClicked={didILike}
			/>
			<UndoLikeConfirmModal
				{...{onCancelClick, onConfirmClick, ...modalState}}
			/>
		</>
	);
}

export default LikeButton;
