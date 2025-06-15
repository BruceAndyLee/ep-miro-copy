import { delay, HttpResponse } from "msw";
import { http } from "../http";
import type { ApiComponents } from "../../schema";

const boards: ApiComponents["schemas"]["Board"][] = [
    {
        id: "b-1",
        name: "TPS networking overview",
    },
    {
        id: "b-2",
        name: "CTX architecture proposal",
    }
]

export const boardHandlers = [
    http.get("/boards", async () => {
        await delay(400)
        return HttpResponse.json(boards);
    }),
    http.post("/boards", async (ctx) => {
        const payload = await ctx.request.json();
        const newBoard = {
            id: crypto.randomUUID(),
            name: payload.name,
        };
        boards.push(newBoard);
        return HttpResponse.json(newBoard);
    }),
    http.delete("/boards/{id}", async (ctx) => {
        const targetId = ctx.params.id;
        console.log("requested to delete targetId", targetId);
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
    })
];
