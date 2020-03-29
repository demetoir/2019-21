import React, {useRef} from "react";
import styled from "styled-components";
import QuestionContainerTabBar from "./QuestionContainerTabBar.js";
import useTabs from "../../hooks/useTabs.js";
import AddQuestionInputButton from "./AddQuestionInputButton.js";
import QuestionCardList from "../QuestionCard/QuestionCardList.js";
import {socketClient} from "../../socket.io";
import PaddingArea from "../atoms/PaddingArea.js";
import QuestionCardEditMenuDrawer from "../QuestionCardEditMenuDrawer/QuestionCardEditMenuDrawer.js";
import NewQuestionInputDrawer from "./NewQuestionInputDrawer.js";
import EditQuestionInputDrawer from "./EditQuestionInputDrawer.js";
import MyQuestionsDrawer from "./MyQuestionDrawer.js";
import useUIController from "../../contexts/UIController/useUIController.js";
import useQuestions from "../../contexts/Questions/useQuestions.js";
import {
	QUESTION_ACTION_TYPE_SORT_BY_LIKE_COUNT,
	QUESTIONS_ACTION_TYPE_SORT_BY_RECENT,
} from "../../constants/question_action_types.js";
import {SOCKET_IO_EVENT_QUESTION_REMOVE} from "../../constants/socket.io-event.js";
import {POPULAR_TAB_IDX, RECENT_TAB_IDX} from "../../constants/Question_tab_inner_TabBar_idx.js";



const QuestionContainerStyle = styled.div`
	overflow-y: scroll;
	height: 100%;
`;

function QuestionContainer() {
	const {dispatch, questions, replies} = useQuestions();

	const staredQuestions = questions.filter(e => e.isStared);
	const nonStaredQuestions = questions.filter(e => !e.isStared);

	const {
		newQuestionInputDrawer,
		editQuestionInputDrawer,
		questionEditMenuReducer,
		myQuestionDrawerReducer,
	} = useUIController();
	const {tabIdx, selectTabIdx} = useTabs(RECENT_TAB_IDX);
	const userNameRef = useRef(null);
	const questionRef = useRef(null);

	const onContainerSelectTab = (event, newValue) => {
		if (newValue === RECENT_TAB_IDX) {
			dispatch({type: QUESTIONS_ACTION_TYPE_SORT_BY_RECENT});
		}

		if (newValue === POPULAR_TAB_IDX) {
			dispatch({type: QUESTION_ACTION_TYPE_SORT_BY_LIKE_COUNT});
		}

		selectTabIdx(event, newValue);
	};

	const onDeleteQuestion = () => {
		socketClient.emit(
			SOCKET_IO_EVENT_QUESTION_REMOVE,
			questionEditMenuReducer.data,
		);
		questionEditMenuReducer.setOff();
	};

	return (
		<QuestionContainerStyle>
			<QuestionContainerTabBar
				tabIdx={tabIdx}
				onSelectTab={onContainerSelectTab}
			/>
			<QuestionCardList questions={staredQuestions} replies={replies} />
			<QuestionCardList
				questions={nonStaredQuestions}
				replies={replies}
			/>
			<PaddingArea />
			<AddQuestionInputButton
				onClick={() => newQuestionInputDrawer.setOn()}
			/>
			<NewQuestionInputDrawer
				userNameRef={userNameRef}
				questionRef={questionRef}
				toggleReducer={newQuestionInputDrawer}
			/>
			<EditQuestionInputDrawer
				userNameRef={userNameRef}
				questionRef={questionRef}
				toggleReducer={editQuestionInputDrawer}
			/>
			<QuestionCardEditMenuDrawer
				isOpen={questionEditMenuReducer.state}
				onClose={() => questionEditMenuReducer.setOff()}
				onDelete={onDeleteQuestion}
				onEdit={() => {
					editQuestionInputDrawer.setOn(questionEditMenuReducer.data);
				}}
			/>
			<MyQuestionsDrawer
				isOpen={myQuestionDrawerReducer.state}
				onClose={() => {
					myQuestionDrawerReducer.setOff();
				}}
			/>
		</QuestionContainerStyle>
	);
}

export default QuestionContainer;
