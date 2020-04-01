import React from "react";
import PropTypes from "prop-types";
import {styled} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";

const colorBlue = "#3f51b5";
const TextField = styled(Typography)({
	marginLeft: 10,
	textAlign: "center",
	textDecoration: "none",
	cursor: "pointer",
	"&:hover": {
		color: colorBlue,
	},
});

function ReplyNumber(props) {
	const {openReplies, replyCount} = props;

	return (
		<TextField variant="subtitle1" onClick={openReplies}>
			{`댓글 ${replyCount}개`}
		</TextField>
	);
}

ReplyNumber.propTypes = {
	replyCount: PropTypes.number,
	openReplies: PropTypes.func,
};

export default ReplyNumber;
