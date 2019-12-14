import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import {ApolloProvider} from "@apollo/react-hooks";
import createApolloClient from "./libs/createApolloClient";
import "./index.css";
import App from "./App/App.js";
import * as serviceWorker from "./libs/serviceWorker.js";
import config from "./config";

const cookieName = "vaagle-guest";
const token = Cookies.get(cookieName);
const client = createApolloClient(config.apolloURI, token);


ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
