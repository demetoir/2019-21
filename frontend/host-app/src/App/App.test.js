import React from "react";
import ReactDOM from "react-dom";
import {MockedProvider} from "@apollo/react-testing";
import AppLoadingWrapper from "./AppLoadingWrapper.js";

it("renders loading page without crashing", () => {
	const div = document.createElement("div");

	ReactDOM.render(
		<MockedProvider mocks={[]}>
			<AppLoadingWrapper/>
		</MockedProvider>,
		div);
	ReactDOM.unmountComponentAtNode(div);
});
