import {getLikesByGuestId} from "../../../DB/queries/like.js";

const didILikesResolver = async (_, {GuestId}) => getLikesByGuestId(GuestId);

// noinspection JSUnusedGlobalSymbols
export default {
	Query: {
		didILikes: didILikesResolver,
	},
};
