import {GraphQLClient} from "graphql-request";
import config from "../../graphQL/config.js";

const endpointUrl = `http://localhost:${config.port}${config.endpoint}`;

export default new GraphQLClient(endpointUrl, {headers: {}});
