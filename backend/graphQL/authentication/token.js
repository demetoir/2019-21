import jwt from "jsonwebtoken";

function generateAccessToken(hostOauthId) {
	const tokenArgs = {
		secret: process.env.AUTH_TOKEN_SECRET,
		issuer: process.env.AUTH_TOKEN_ISSUER,
		audience: process.env.AUTH_TOKEN_AUDIENCE,
	};
	const expiresIn = "1 hour";
	const token = jwt.sign({}, tokenArgs.secret, {
		expiresIn: expiresIn,
		issuer: tokenArgs.issuer,
		audience: tokenArgs.audience,
		subject: hostOauthId,
	});

	return token;
}

export { generateAccessToken };