import {socketClient} from "../../libs/socket.io-Client-wrapper.js";

// allowDuplication == false, 즉, 복수선택이 아닌 경우, 이전에 vote 한 candidate가 있으면 삭제해야 함
const getCandidateToDelete = (items, candidateId) => {
	const candidate = items.filter(
		item => item.voted && item.id !== candidateId,
	)[0];

	return candidate ? candidate.id : null;
};

// 복수선택이 아닌 투표의 경우, 다른 선택된 항목을 uncheck 하는 함수
const uncheckOtherItems = items => {
	items.forEach(item => {
		if (item.voted) {
			item.voted = false;
			item.voters--;
		}
	});
};

// N지선다형 투표에서 CLICK 으로 인해 상태 변화가 발생한 경우 처리하는 함수
const updateItems = (items, number, allowDuplication) => {
	const newItems = [...items];

	if (newItems[number].voted) {
		newItems[number].voted = false;
		newItems[number].voters--;
	} else {
		if (!allowDuplication) {
			uncheckOtherItems(newItems);
		}
		newItems[number].voted = true;
		newItems[number].voters++;
	}
	return newItems;
};

// 별점 투표는 목록이 최대 별점갯수만큼 있음. 선택한 value - 1 이 index가 됨
const updateRatingItem = (items, value, voted) => {
	const newItems = [...items];

	if (voted) {
		newItems[value - 1].voters++;
		newItems[value - 1].voted = voted;
	} else {
		newItems[value - 1].voters++;
		newItems[value - 1].voted = voted;
	}

	return newItems;
};

// 투표의 참여 총인원수를 계산하는 함수 (복수선택 고려함)
const updateTotalVoters = (notVoted, totalVoters, items) => {
	let result = totalVoters;

	if (notVoted) {
		if (items.some(item => item.voted)) {
			result = totalVoters + 1;
		}
	} else if (items.every(item => item.voted === false)) {
		result = totalVoters - 1;
	}

	return result;
};

const emitVoteData = (vote, poll, candidateToDelete) => {
	const action = poll.nItems[vote.number].voted ? "on" : "off";
	const data = {
		GuestId: vote.GuestId,
		CandidateId: vote.candidateId,
		allowDuplication: poll.allowDuplication,
		poll,
		candidateToDelete,
	};

	// console.log("emitVoteData", data);
	socketClient.emit(`vote/${action}`, data);
};

const emitRateData = (rate, poll, candidateId, index) => {
	const action = rate.type === "RATE" ? "on" : "off"; // "on" or "off"
	const data = {
		GuestId: rate.GuestId,
		CandidateId: candidateId,
		poll,
		index,
	};

	socketClient.emit(`rate/${action}`, data);
};

export default function reducer(polls, action) {
	let thePoll;
	let index;
	let candidateId;

	if (action.id) {
		thePoll = polls.filter(poll => poll.id === action.id)[0];
	}

	switch (action.type) {
		case "NOTIFY_OPEN":
			return [action.poll, ...polls];
		case "SOMEONE_VOTE":
			thePoll.totalVoters = action.poll.totalVoters;
			thePoll.nItems.forEach((item, index) => {
				item.voters = action.poll.nItems[index].voters;
				item.firstPlace = action.poll.nItems[index].firstPlace;
			});
			// console.log("SOMEONE_VOTE", thePoll);
			return polls.map(poll => (poll.id === action.id ? thePoll : poll));
		case "SOMEONE_RATE":
			thePoll.totalVoters = action.poll.totalVoters;
			// console.log("SOMEONE_RATE", thePoll);
			return polls.map(poll => (poll.id === action.id ? thePoll : poll));
		case "VOTE":
			const notVoted = thePoll.nItems.every(item => item.voted === false);
			let candidateToDelete = null;

			if (!thePoll.allowDuplication) {
				candidateToDelete = getCandidateToDelete(
					thePoll.nItems,
					action.candidateId,
				);
			}
			thePoll = {
				...thePoll,
				nItems: updateItems(
					thePoll.nItems,
					action.number,
					thePoll.allowDuplication,
				),
				totalVoters: updateTotalVoters(
					notVoted,
					thePoll.totalVoters,
					thePoll.nItems,
				),
			};
			emitVoteData(action, thePoll, candidateToDelete);
			return polls.map(poll => (poll.id === action.id ? thePoll : poll));

		case "RATE":
			if (thePoll.rated) {
				return polls;
			}
			thePoll = {
				...thePoll,
				nItems: updateRatingItem(thePoll.nItems, action.value, true),
				rated: true,
				ratingValue: action.value,
				totalVoters: thePoll.totalVoters + 1,
			};
			// console.log("RATE", action, thePoll);
			index = parseInt(action.value) - 1;
			candidateId = thePoll.nItems[index].id;
			emitRateData(action, thePoll, candidateId, index);
			return polls.map(poll => (poll.id === action.id ? thePoll : poll));

		case "CANCEL_RATING":
			if (!thePoll.rated) {
				return polls;
			}
			index = parseInt(thePoll.ratingValue) - 1;
			thePoll = {
				...thePoll,
				nItems: updateRatingItem(
					thePoll.nItems,
					thePoll.ratingValue,
					false,
				),
				rated: false,
				ratingValue: 0,
				totalVoters: thePoll.totalVoters - 1,
			};
			// console.log("CANCEL_RATE", action, thePoll);
			candidateId = thePoll.nItems[index].id;
			emitRateData(action, thePoll, candidateId, index);
			return polls.map(poll => (poll.id === action.id ? thePoll : poll));

		default:
			throw new Error("Unhandled action.");
	}
}
