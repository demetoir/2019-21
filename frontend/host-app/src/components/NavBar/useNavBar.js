import {useState} from "react";

const NAV_BAR_DEFAULT_TAB_IDX = 0;

export default function useNavBar(initialValue = NAV_BAR_DEFAULT_TAB_IDX) {
	const [tabIdx, selectTab] = useState(initialValue);
	const onChange = (e, selectedTabIdx) => {
		selectTab(selectedTabIdx);
	};

	return {tabIdx, onChange};
}
