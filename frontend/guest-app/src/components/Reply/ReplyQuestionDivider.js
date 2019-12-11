import React from "react";
import {styled} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";

const Container = styled(Box)({
	marginTop: "1rem",
	marginLeft: "0.6rem",
	marginBottom: "1rem",
	display: "flex",
	flexDirection: "row",
});

const ReplieNumField = styled(Box)({
	fontWeight: "bold",
});

const CustomDivider = styled(Divider)({
	marginLeft: "2rem",
	width: "90%",
	height: "0.2rem",
	marginTop: "0.8rem",
});

function ReplyQuestionDivider(props) {
	const {replies} = props;

	return (
		<Container>
			<ReplieNumField>{`${replies.length} replies`}</ReplieNumField>
			<CustomDivider></CustomDivider>
		</Container>
	);
}

export default ReplyQuestionDivider;