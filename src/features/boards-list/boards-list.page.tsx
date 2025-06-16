import { rqClient } from "@/shared/api/rest-clients";
import type { ApiComponents } from "@/shared/api/schema";
import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes"
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { useQueryClient } from "@tanstack/react-query";
import { href, Link } from "react-router-dom"

export function BoardsList() {

    const apiURL = CONFIG.API_BASE_URL;

    const queryClient = useQueryClient();
    const boardsQuery = rqClient.useQuery("get", "/boards", { headers: {  } });

    const createBoardMutation = rqClient.useMutation("post", "/boards", {
        onSettled: async () => {
            // this code invalidates the latest result from the GET /boards query
            await queryClient.invalidateQueries(rqClient.queryOptions("get", "/boards"))
        },
    });
    const deleteBoardMutation = rqClient.useMutation("delete", "/boards/{id}", {
        onSettled: async () => {
            // async is added to the invalidation so that query is deemed OVER
            // only after the invalidation is complete
            await queryClient.invalidateQueries(rqClient.queryOptions("get", "/boards"))
        },
    });

    const onSubmitNewBoard = (e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        createBoardMutation.mutate({
            body: {
                name: formData.get("Board name") as string
            }
        })
    }

    const onDeleteBoard = (board: ApiComponents["schemas"]["Board"]) => {
        console.log("onDeleteBoard: board", board);

        deleteBoardMutation.mutate(
            { params: { path: { id: board.id } } },
        )
    }

    return <div>
        <h2>Boards list (loaded from {apiURL})</h2>
        <form onSubmit={onSubmitNewBoard}>
            <input name="Board name" id="name" type="text"></input>
            <button type="submit">Create board</button>
        </form>
        <div className="container mx-auto px-4">
            {boardsQuery.data?.map((board) => (
                <Card>
                    <CardHeader>
                        <Button asChild variant="link">
                            <Link to={href(ROUTES.BOARD, { id: board.id })} key={board.id}>{board.name}</Link>
                        </Button>
                    </CardHeader>
                    <CardFooter>
                        <Button
                            variant="destructive"
                            disabled={deleteBoardMutation.isPending}
                            onClick={() => onDeleteBoard(board)}
                        >
                            Delete board
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
}

// формат экспорта, которого требует роутер реакта
export const Component = BoardsList;