import React, {useState} from "react";
import styled from "styled-components";
import Cookie from "js-cookie";
import {Button, TextField, Typography} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
import config from "../config";
import {GUEST_COOKIE_KEY, HOST_COOKIE_KEY} from "../constants/CookieKeys.js";

const EventFormStyle = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: auto;
	justify-content: center;
	align-items: center;
	h1 {
		margin-bottom: 1rem;
	}
`;

const ErrorStyle = styled.div`
	color: red;
	height: 2rem;
`;

const StyledTextField = withStyles({
	root: {
		width: "300px",
	},
})(TextField);

const StyledButton = withStyles({
	root: {
		width: "300px",
		fontSize: "1.4rem",
	},
})(Button);

function EventForm() {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const initialErrorMessage = "";
	const [errorMessage, setMessage] = useState(initialErrorMessage);
	const initialCode = "";
	const [code, setCode] = useState(initialCode);
	const onChange = e => {
		setCode(e.target.value);
		setMessage(initialErrorMessage);
	};
	const onEnterEvent = () => {
		setMessage("이벤트 번호가 전달되었습니다.");
		const path = window.btoa(code);

		window.location.href = `${config.guestAppURL}/${path}`;
		setCode(initialCode);
	};

	const hostCookie = Cookie.get(HOST_COOKIE_KEY);
	const guestCookie = Cookie.get(GUEST_COOKIE_KEY);
	const empty = !hostCookie && !guestCookie;

	return (
		<EventFormStyle>
			<Typography variant="h3" component="h1">
				바글바글
			</Typography>
			{/* <img src="vaagle.png" width="200" height="auto" /> */}
			<Typography>익명으로 질문할 수 있습니다.</Typography>
			<Typography>강의 중 궁금한 것들을 편하게 질문하세요.</Typography>

			<form autoComplete="off">
				<div>
					<StyledTextField
						required
						autoFocus
						id="outlined-basic"
						name="eventCode"
						margin="normal"
						variant="outlined"
						placeholder="이벤트 코드를 입력하세요"
						onChange={onChange}
						value={code}
					/>
				</div>
				<StyledButton
					variant="contained"
					color="primary"
					size="large"
					type="submit"
					onClick={onEnterEvent}
				>
					참가하기
				</StyledButton>
				<ErrorStyle>{errorMessage}</ErrorStyle>
			</form>
			<Button onClick={handleClick}>
				<h3>최근목록</h3>
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{hostCookie && (
					<MenuItem onClick={handleClose}>
						<a href={`${config.hostAppURL}/`}>Go To Host</a>
					</MenuItem>
				)}
				{guestCookie && (
					<MenuItem onClick={handleClose}>
						<a href={`${config.guestAppURL}/`}>Go To Guest</a>
					</MenuItem>
				)}
				{empty && (
					<MenuItem onClick={handleClose}>
						최근 기록이 없습니다
					</MenuItem>
				)}
			</Menu>
		</EventFormStyle>
	);
}

export default EventForm;
