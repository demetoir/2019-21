import emojiResolvers from "./model/emoji/emoji.resolver.js";
import hostpageResolvers from "./model/hostpage/hostpage.resolver.js";
import guestResolvers from "./model/guest/guest.resolver.js";
import likeResolvers from "./model/like/like.resolver.js";
import questionResolvers from "./model/question/question.resolver.js";
import pollGuestResolvers from "./model/poll/pollGuest.resolver.js";
import pollHostResolvers from "./model/poll/pollHost.resolver.js";
import helloResolvers from "./model/hello/hello.resolver.js";

const resolvers = [
	emojiResolvers,
	hostpageResolvers,
	guestResolvers,
	likeResolvers,
	questionResolvers,
	pollGuestResolvers,
	pollHostResolvers,
	helloResolvers,
];

export default resolvers;
