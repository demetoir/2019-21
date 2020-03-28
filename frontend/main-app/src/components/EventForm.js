import styled from "styled-components";
import React, {useState} from "react";
import config from "../config";
import EventCodeInput from "./EventCodeInput.js";
import EventEnterButton from "./EnterEventButton.js";
import EventCodeInputErrorMessageStyle from "./EventCodeInputErrorMessageStyle.js";

const enterEventMessage = "이벤트 번호가 전달되었습니다.";
const initialErrorMessage = "";
const initialCode = "";

const EventFormStyle = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

function EventForm() {
	const [errorMessage, setMessage] = useState(initialErrorMessage);
	const [code, setCode] = useState(initialCode);
	const onChange = e => {
		setCode(e.target.value);
		setMessage(initialErrorMessage);
	};
	const onEnterEvent = () => {
		setMessage(enterEventMessage);
		const path = window.btoa(code);

		window.location.href = `${config.guestAppURL}/${path}`;
		setCode(initialCode);
	};

	return (
		<form autoComplete="off">
			<EventFormStyle>
				<EventCodeInput onChange={onChange} value={code}/>
				<EventEnterButton onClick={onEnterEvent}/>
				<EventCodeInputErrorMessageStyle>
					{errorMessage}
				</EventCodeInputErrorMessageStyle>
			</EventFormStyle>
		</form>
	);
}

export default EventForm;
