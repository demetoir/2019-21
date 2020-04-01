import React from "react";
import styled from "styled-components";
import {Typography} from "@material-ui/core";
import GoogleOAuthLoginButton from "./GoogleOAuthLoginButton.js";

const AppFooterStyle = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: right;
	margin-bottom: 2rem;
	height: 4rem;
	div {
		margin-bottom: 0.5rem;
	}
`;

function AppFooter() {
	return (
		<AppFooterStyle>
			<Typography>이벤트를 만들려면, 로그인 해주세요.</Typography>
			<GoogleOAuthLoginButton/>
		</AppFooterStyle>
	);
}

export default AppFooter;
