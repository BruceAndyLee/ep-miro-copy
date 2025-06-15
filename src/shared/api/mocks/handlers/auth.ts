import { delay, HttpResponse } from "msw";
import type { ApiComponents } from "../../schema";
import { http } from "../http";

const userPasswords = new Map<string, string>();
const activeTokens = new Map<string, string>();
const users: ApiComponents["schemas"]["User"][] = [];

const addToken = (username: string) => {
    const mockedToken = `mock-token-${Date.now()}`;
    activeTokens.set(username, mockedToken);
    return mockedToken;
}

const checkToken = (username: string) => {
    const savedToken = activeTokens.get(username);
    if (savedToken) {
        return savedToken;
    }

    return addToken(username)
}

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
        const mockedToken = checkToken(username);
        await delay(800);
        return HttpResponse.json(
            { message: "Authorization successfull", accessToken: mockedToken, user: targetUser, code: "OK" }
        )
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
        const mockedToken = addToken(username);
        await delay(800);
        return HttpResponse.json(
            { message: "Registration successful", accessToken: mockedToken, user: newUser,  code: "OK" },
            { status: 201 },
        );

    }),
    http.post("/auth/refresh", () => {
        
    }),
];