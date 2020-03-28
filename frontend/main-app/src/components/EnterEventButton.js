import {withStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import React from "react";

const StyledButton = withStyles({
	root: {
		width: "300px",
		fontSize: "1.4rem",
	},
})(Button);

export default function EventEnterButton({onClick}) {
	return (
		<StyledButton
			variant="contained"
			color="primary"
			size="large"
			type="submit"
			onClick={onClick}
		>
			참가하기
		</StyledButton>
	);
}
