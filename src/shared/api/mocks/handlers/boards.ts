import { delay, HttpResponse } from "msw";
import { http } from "../http";
import type { ApiComponents, ApiPaths } from "../../schema";
import { verifyRequestAuthHeader } from "../session";
import type { ResponseResolverInfo } from "openapi-msw";

const boards: ApiComponents["Board"][] = [
    {
        id: "b-1",
        name: "TPS networking overview",
        createdAt: "",
        updatedAt: "",
        lastOpenedAt: "",
        isFavourite: false
    },
    {
        id: "b-2",
        name: "CTX architecture proposal",
        createdAt: "",
        updatedAt: "",
        lastOpenedAt: "",
        isFavourite: false
    }
]

function genNewBoard(): ApiComponents["Board"] {
    return {
        id: crypto.randomUUID(),
        name: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        isFavourite: false,
    }
}

// TODO: write a soundly typed auth-checker wrapper function for all endpoint-callbacks

export const boardHandlers = [
    http.get("/boards", async (ctx) => {
        await verifyRequestAuthHeader(ctx.request);

        await delay(400)
        return HttpResponse.json({ data: boards, total: boards.length });
    }),
    http.post("/boards", async (ctx) => {
        await verifyRequestAuthHeader(ctx.request);

        // take care of filtration

        // take care of sorting

        // take care of pagination
        // const limit = ctx.query.get("limit");
        // const offset = ctx.query.get("offset");
        

        const newBoard = genNewBoard();
        boards.push(newBoard);
        return HttpResponse.json(newBoard);
    }),
    http.get("/boards/{id}", async (ctx) => {
        await verifyRequestAuthHeader(ctx.request);
    }),
    http.delete("/boards/{id}", async (ctx) => {
        await verifyRequestAuthHeader(ctx.request);
        const targetId = ctx.params.id;
        const boardToDeleteIdx = boards.findIndex((board) => board.id === targetId);
        if (boardToDeleteIdx === -1) {
            return HttpResponse.json(
                { message: "Board not found", code: "NOT_FOUND" },
                { status: 404 }
            )
        }
        boards.splice(boardToDeleteIdx, 1);
        await delay(800)
        return HttpResponse.json(
            { message: "Board deleted", code: "OK" },
            { status: 204 },
        )
    }),
];
