import { HttpResponse } from "msw";
import { http } from "../http";
import type { ApiComponents } from "../../schema";

type MiroDBState = {
    boards: ApiComponents["schemas"]["Board"][],
}

const state: MiroDBState = {
    boards: [
        {
            id: "b-1",
            name: "TPS networking overview",
        },
        {
            id: "b-2",
            name: "CTX architecture proposal",
        }
    ]
}

export const handlers = [
    http.get("/boards", () => {
        return HttpResponse.json(state.boards);
    }),
    http.post("/boards", async (ctx) => {
        const payload = await ctx.request.json();
        const newBoard = {
            id: crypto.randomUUID(),
            name: payload.name,
        };
        state.boards.push(newBoard);
        return HttpResponse.json(newBoard);
    }),
    http.delete("/boards/{id}", (ctx) => {
        const targetId = ctx.params.id;
        console.log("requested to delete targetId", targetId);
        const boardToDeleteIdx = state.boards.findIndex((board) => board.id === targetId);
        if (boardToDeleteIdx === -1) {
            return HttpResponse.json(
                { message: "Board not found", code: "NOT_FOUND" },
                { status: 404 }
            )
        }
        state.boards.splice(boardToDeleteIdx, 1);
        return HttpResponse.json(
            { message: "Board deleted", code: "OK" },
            { status: 204 },
        )
    })
];
