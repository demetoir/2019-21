import React, {useReducer, useState} from "react";
import styled from "styled-components";
import PollCard from "./PollCard";
import {useSocket} from "../../socket.io";
import reducer from "../../reducers/PollsReducer.js";
import useGlobalData from "../../contexts/GlobalData/useGlobalData.js";
import usePolls from "../../contexts/Polls/usePolls.js";
import {
	SOCKET_IO_EVENT_POLL_NOTIFY_CLOSE,
	SOCKET_IO_EVENT_POLL_NOTIFY_OPEN,
	SOCKET_IO_EVENT_RATE_OFF,
	SOCKET_IO_EVENT_RATE_ON,
	SOCKET_IO_EVENT_VOTE_OFF,
	SOCKET_IO_EVENT_VOTE_ON,
} from "../../constants/socket.io-event.js";
import {
	POLL_STATE_CLOSED,
	POLL_STATE_RUNNING,
} from "../../constants/poll_state.js";
import {
	POLL_ACTION_TYPE_CANCEL_RATING,
	POLL_ACTION_TYPE_NOTIFY_CLOSE,
	POLL_ACTION_TYPE_NOTIFY_OPEN,
	POLL_ACTION_TYPE_RATE,
	POLL_ACTION_TYPE_SOMEONE_RATE,
	POLL_ACTION_TYPE_SOMEONE_VOTE,
	POLL_ACTION_TYPE_VOTE,
} from "../../constants/poll_action_type.js";
import {SOCKET_IO_RESPONSE_STATE_ERROR} from "../../constants/socket_io_response.js";

const colorGray3 = "#dee2e6";
const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	box-sizing: border-box;
	border: 1px solid ${colorGray3};
	padding: 1rem;
	width: 100%;
`;

function PollContainer() {
	const {guest} = useGlobalData();
	const GuestId = guest.id;

	const {pollGuest} = usePolls();
	const data = pollGuest;

	let rPolls = null;
	let cPolls = null;

	if (data) {
		const initialPolls = data;

		rPolls = initialPolls.filter(poll => poll.state === POLL_STATE_RUNNING);
		cPolls = initialPolls.filter(poll => poll.state === POLL_STATE_CLOSED);
	}

	const [runningPolls, dispatch] = useReducer(reducer, rPolls);
	const [closedPolls, setClosedPolls] = useState(cPolls);

	// guest가 N지선다형 투표를 했을때 호출되는 handler
	const onVote = (id, candidateId, number, state) => {
		if (state !== POLL_STATE_RUNNING) return;

		dispatch({
			type: POLL_ACTION_TYPE_VOTE,
			pollId: id,
			candidateId,
			number,
			GuestId,
		});
	};

	// guest가 별점매기기 투표를 했을때 호출되는 handler
	const onChange = (value, state, id) => {
		if (state !== POLL_STATE_RUNNING) return;

		dispatch({
			type: POLL_ACTION_TYPE_RATE,
			value,
			pollId: id,
			GuestId,
		});
	};

	// guest가 별점매기기 투표를 취소했을때 호출되는 handler
	const onCancelRating = (id, state) => {
		if (state !== POLL_STATE_RUNNING) return;

		dispatch({
			type: POLL_ACTION_TYPE_CANCEL_RATING,
			pollId: id,
			GuestId,
		});
	};

	// host가 투표를 open했음을 guest들에게 socket.io 서버로 emit 하면
	// guest들은 아래 함수를 통해 listen하고 있다가
	// useReduer를 호출하여 투표에 상태를 update 함

	useSocket(SOCKET_IO_EVENT_POLL_NOTIFY_OPEN, res => {
		if (res.status === SOCKET_IO_RESPONSE_STATE_ERROR) {
			return;
		}

		dispatch({
			type: POLL_ACTION_TYPE_NOTIFY_OPEN,
			poll: res.poll,
			GuestId,
		});
	});

	// host가 투표를 close했음을 guest들에게 socket.io 서버로 emit 하면
	// guest들은 아래 함수를 통해 listen하고 있다가
	// useReduer를 호출하여 투표에 상태를 update 함

	useSocket(SOCKET_IO_EVENT_POLL_NOTIFY_CLOSE, res => {
		if (res.status === SOCKET_IO_RESPONSE_STATE_ERROR) {
			return;
		}

		const {pollId} = res;
		const thePoll = {...runningPolls.find(poll => poll.id === pollId)};

		thePoll.state = POLL_STATE_CLOSED;
		setClosedPolls([thePoll].concat(closedPolls));

		dispatch({
			type: POLL_ACTION_TYPE_NOTIFY_CLOSE,
			pollId,
		});
	});

	// 다른 guest들이 투표했음을 socket.io 서버로 emit 하면
	// guest는 아래 함수를 통해 listen하고 있다가
	// useReduer를 호출하여 투표에 상태를 update 함

	useSocket(SOCKET_IO_EVENT_VOTE_ON, res => {
		if (res.status === SOCKET_IO_RESPONSE_STATE_ERROR) {
			// eslint-disable-next-line no-console
			console.error("vote/on ERROR");
			return;
		}
		// 하나의 브라우저에서 여러개의 tab으로 guest들을 생성한 경우,
		// 해당 guest를 제외한 나머지 guest에 상태가 적용되지 않아서 comment 처리했음

		dispatch({
			type: POLL_ACTION_TYPE_SOMEONE_VOTE,
			pollId: res.poll.id,
			poll: res.poll,
			GuestId,
		});
	});

	// 다른 guest들이 투표했음을 socket.io 서버로 emit 하면
	// guest는 아래 함수를 통해 listen하고 있다가
	// useReduer를 호출하여 투표에 상태를 update 함

	useSocket(SOCKET_IO_EVENT_VOTE_OFF, res => {
		if (res.status === SOCKET_IO_RESPONSE_STATE_ERROR) {
			// eslint-disable-next-line no-console
			console.error("vote/off ERROR");
			return;
		}
		// 하나의 브라우저에서 여러개의 tab으로 guest들을 생성한 경우,
		// 해당 guest를 제외한 나머지 guest에 상태가 적용되지 않아서 comment 처리했음
		dispatch({
			type: POLL_ACTION_TYPE_SOMEONE_VOTE,
			pollId: res.poll.id,
			poll: res.poll,
			GuestId,
		});
	});

	// 다른 guest들이 별점매기기 했음을 socket.io 서버로 emit 하면
	// guest는 아래 함수를 통해 listen하고 있다가
	// useReduer를 호출하여 투표에 상태를 update 함

	useSocket(SOCKET_IO_EVENT_RATE_ON, res => {
		if (res.status === SOCKET_IO_RESPONSE_STATE_ERROR) {
			return;
		}
		// 하나의 브라우저에서 여러개의 tab으로 guest들을 생성한 경우,
		// 해당 guest를 제외한 나머지 guest에 상태가 적용되지 않아서 comment 처리했음
		dispatch({
			type: POLL_ACTION_TYPE_SOMEONE_RATE,
			pollId: res.poll.id,
			poll: res.poll,
			GuestId,
		});
	});

	// 다른 guest들이 별점매기기를 취소했음을 socket.io 서버로 emit 하면
	// guest는 아래 함수를 통해 listen하고 있다가
	// useReduer를 호출하여 투표에 상태를 update 함

	useSocket(SOCKET_IO_EVENT_RATE_OFF, res => {
		if (res.status === SOCKET_IO_RESPONSE_STATE_ERROR) {
			return;
		}
		// 하나의 브라우저에서 여러개의 tab으로 guest들을 생성한 경우,
		// 해당 guest를 제외한 나머지 guest에 상태가 적용되지 않아서 comment 처리했음
		dispatch({
			type: POLL_ACTION_TYPE_SOMEONE_RATE,
			pollId: res.poll.id,
			poll: res.poll,
			GuestId,
		});
	});

	return (
		<ColumnWrapper>
			{runningPolls &&
				runningPolls.map(poll => (
					<PollCard
						{...poll}
						key={poll.id}
						onVote={onVote}
						onChange={onChange}
						onCancelRating={onCancelRating}
					/>
				))}
			{closedPolls &&
				closedPolls.map(poll => (
					<PollCard {...poll} key={poll.id} onVote={onVote} />
				))}
		</ColumnWrapper>
	);
}

export default PollContainer;
