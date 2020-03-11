import {findHostByOAuthId} from "../../DB/queries/host.js";
import logger from "../logger.js";
import {
	AUTHORITY_TYPE_GUEST,
	AUTHORITY_TYPE_HOST,
} from "../../constants/authorityTypes.js";

const authenticate = async (resolve, root, args, context, info) => {
	const audience = context.payload && context.payload.aud;
	let authority = {sub: null, info: null};

	switch (audience) {
		case AUTHORITY_TYPE_HOST: {
			const hostInfo = await findHostByOAuthId(context.payload.sub);

			authority = {sub: AUTHORITY_TYPE_HOST, info: hostInfo};
			break;
		}
		case AUTHORITY_TYPE_GUEST: {
			const guestInfo = context.payload.sub;

			authority = {sub: AUTHORITY_TYPE_GUEST, info: guestInfo};
			break;
		}
		default: {
			logger.error(`unexpected type of audience ${audience}`);
		}
	}

	return resolve(root, args, authority, info);
};

export default authenticate;
