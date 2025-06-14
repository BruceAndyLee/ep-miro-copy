import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes"
import { href, Link } from "react-router-dom"

export function BoardsList() {

    const apiURL = CONFIG.API_BASE_URL;

    return <div>
        <h2>Boards list (loaded from {apiURL})</h2>

        <ul>
            <li>
                <Link to={href(ROUTES.BOARD, { boardId: "1" })}>Board #1</Link>
            </li>
        </ul>
    </div>
}

// формат экспорта, которого требует роутер реакта
export const Component = BoardsList;