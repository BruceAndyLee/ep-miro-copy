import { SignJWT, jwtVerify } from "jose";
import { HttpResponse } from "msw";

type Session = {
  userId: string;
  username: string;
};

const JWT_SECRET = new TextEncoder().encode("your-secret-key"); // secret key is usually in the ci/cd variables
const ACCESS_TOKEN_EXPIRY = "3s";
const REFRESH_TOKEN_EXPIRY = "7d";

export function createRefreshTokenCookie(refreshToken: string) {
  return `refreshToken=${refreshToken}; Max-Age=604800`;
}

/**
 * Used in the msw-mock for the login and register enpoints
 * @param session 
 * @returns 
 */
export async function generateTokens(session: Session) {
  const accessToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return { accessToken, refreshToken };
}

async function verifyToken(token: string): Promise<Session> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as Session;
}

/**
 * used in all private endpoint mocks to check that the access-jwt is valid
 * @param request 
 * @returns 
 */
export async function verifyTokenOrThrow(request: Request): Promise<Session> {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  const session = token ? await verifyToken(token).catch(() => null) : null;
  if (!session) {
    throw HttpResponse.json(
      {
        message: "Invalid token",
        code: "INVALID_TOKEN",
      },
      { status: 401 },
    );
  }
  return session;
}