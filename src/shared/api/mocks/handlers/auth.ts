import { delay, HttpResponse } from "msw";
import type { ApiComponents } from "../../schema";
import { http } from "../http";
import { createRefreshTokenCookie, generateTokens, verifyToken } from "../session";

const userPasswords = new Map<string, string>([
    ["admin@gmail.com", "asdfasdf"]
]);
const users: ApiComponents["schemas"]["User"][] = [
    {
        username: "admin@gmail.com",
        id: "1",
    }
];

export const authHandlers = [
    http.post("/auth/login", async ({ request }) => {
        const { password, username } = await request.json();

        const targetUser = users.find((user) => user.username === username);
        const targetUserPassword = userPasswords.get(targetUser?.username ?? "");
        if (!targetUser || targetUserPassword !== password) {
            return HttpResponse.json(
                { message: "Wrong email or password", code: "INVALID_CREDENTIALS" },
                { status: 401 }
            )
        }
        
        const { accessToken, refreshToken } = await generateTokens({
            userId: targetUser.id,
            username: targetUser.username,
        });

        await delay(800);
        return HttpResponse.json({
            message: "Authorization successfull",
            accessToken: accessToken,
            user: targetUser,
            code: "OK",
        }, {
            status: 200,
            headers: {
                "Set-Cookie": createRefreshTokenCookie(refreshToken)
            }
        })
    }),
    http.post("/auth/register", async ({ request }) => {
        const { password, username } = await request.json();

        const userExists = users.find((user) => user.username === username)
        if (userExists) {
            return HttpResponse.json(
                { message: "User already exists", code: "USER_EXISTS" },
                { status: 401 }
            )
        }

        const newUser = {
            id: crypto.randomUUID(),
            username,
        };
        users.push(newUser);
        userPasswords.set(username, password);
        const { accessToken, refreshToken } = await generateTokens({
            userId: newUser.id,
            username: newUser.username,
        });
        await delay(800);
        return HttpResponse.json(
            {
                message: "Registration successful",
                accessToken: accessToken,
                user: newUser,
                code: "OK",
            },
            {
                status: 201,
                headers: { "Set-Cookie": createRefreshTokenCookie(refreshToken) }
            },
        );

    }),
    http.post("/auth/refresh", async ({ cookies }) => {
        // check that cookies have the refreshToken
        // check that refreshToken can get parsed with OUR backend-secret
        // if so, then issue a new pair of tokens: access and refresh

        // refresh token in this scenario is identical to access-token
        // (it most likely stores session and user too)
        // the only difference is it has a bigger life-span

        // IN REAL PROD LIFE THO
        // refresh token is usually just a session-id, which is kept in the database
        // and can be revoked by different intent other than the /auth/refresh call or just expiration

        const { refreshToken } = cookies;

        try {
            if (!refreshToken) throw new Error("No refresh token")

            const session = await verifyToken(refreshToken);
            const userToReauthorize = users.find((user) => user.id === session.userId);
            if (!userToReauthorize) throw new Error("User does not exist");

            const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
                userId: userToReauthorize.id,
                username: userToReauthorize.username,
            })

            await delay(800);

            return HttpResponse.json({
                message: "Authorization successfull",
                accessToken: accessToken, 
                user: userToReauthorize,
                code: "OK",
            }, {
                status: 200,
                headers: {
                    "Set-Cookie": createRefreshTokenCookie(newRefreshToken)
                }
            })
        } catch (error) {
            console.error("Error refreshing token:", error)
            HttpResponse.json(
                { message: error, code: "AUTHORIZATION_FAILED" },
                { status: 401 }
            )
        }
        
    }),
];