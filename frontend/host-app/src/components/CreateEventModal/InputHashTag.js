import React from "react";
import {styled} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";
import uuidv1 from "uuid/v1";

const ENTER_KEY = 13;
const CustomTextField = styled(TextField)({
	width: 400,
});

function InputHashTag(props) {
	const prevHashTagList = props.hashTags;
	const addHashTag = event => {
		if (event.keyCode === ENTER_KEY) {
			const hashTag = {
				key: uuidv1(),
				label: event.target.value,
			};
			const hashTagList = [...prevHashTagList, hashTag];

			props.dispatch(hashTagList);
			event.target.value = "";
		}
	};

	return (
		<CustomTextField
			id="eventName"
			label="Press Enter"
			color="primary"
			variant="outlined"
			onKeyDown={addHashTag}
		/>
	);
}

export default InputHashTag;
