import React, {useState} from "react";
import Cookie from "js-cookie";
import {Button} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {GUEST_COOKIE_KEY, HOST_COOKIE_KEY} from "../constants/CookieKeys.js";
import config from "../config";

export default function RecentEventList() {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const hostCookie = Cookie.get(HOST_COOKIE_KEY);
	const guestCookie = Cookie.get(GUEST_COOKIE_KEY);
	const empty = !hostCookie && !guestCookie;

	return (
		<>
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
		</>
	);
}
