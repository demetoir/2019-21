import _ from "lodash";
import {fileLoader, mergeTypes} from "merge-graphql-schemas";
import * as path from "path";

const emoji = fileLoader(path.join(__dirname, "./model/emoji/emoji.graphql"));
const guest = fileLoader(path.join(__dirname, "./model/guest/guest.graphql"));
const hello = fileLoader(path.join(__dirname, "./model/hello/hello.graphql"));
const hostpage = fileLoader(
	path.join(__dirname, "./model/hostpage/hostpage.graphql"),
);
const like = fileLoader(path.join(__dirname, "./model/like/like.graphql"));
const poll = fileLoader(path.join(__dirname, "./model/poll/poll.graphql"));
const question = fileLoader(
	path.join(__dirname, "./model/question/question.graphql"),
);

const typesArray = _.flatten([
	emoji,
	guest,
	hello,
	hostpage,
	like,
	poll,
	question,
]);

const typesMerged = mergeTypes(typesArray, {all: true});

export default typesMerged;
