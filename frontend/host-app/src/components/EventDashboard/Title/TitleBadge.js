import React from "react";
import Badge from "@material-ui/core/Badge/Badge";
import {makeStyles} from "@material-ui/core";
import ColumnTypes from "../ColumnTypes.js";

const isPoll = type => type === ColumnTypes.POLL;

const useStyles = makeStyles(theme => ({
	margin: {
		margin: theme.spacing(2),
	},
}));

function TitleBadge({dataLength, type}) {
	const classes = useStyles(undefined);

	return (
		<Badge
			showZero
			color="secondary"
			badgeContent={isPoll(type) ? "P" : dataLength}
			className={classes.margin}
			children={""}
		/>
	);
}

export default TitleBadge;
