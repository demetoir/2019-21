import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import NavBarTab from "./NavBarTab.js";
import NavBarTabs from "./NavBarTabs.js";

const useStyles = makeStyles(theme => ({
	root: {
		marginBottom: theme.spacing(2),
	},
	navBar: {
		backgroundColor: theme.palette.background.paper,
	},
}));

function NavBar(props) {
	const {tabIdx, onChange} = props;
	const classes = useStyles(undefined);

	return (
		<div className={classes.root}>
			<div className={classes.navBar}>
				<NavBarTabs value={tabIdx} onChange={onChange}>
					<NavBarTab label="라이브 이벤트" />
				</NavBarTabs>
			</div>
		</div>
	);
}

NavBar.propTypes = {
	onChange: PropTypes.func,
	tabIdx: PropTypes.number,
};

NavBar.defaultProps = {
	onChange: undefined,
	tabIdx: 0,
};

export default NavBar;
