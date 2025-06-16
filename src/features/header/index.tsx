import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session"
import { Button } from "@/shared/ui/kit/button"
import { useNavigate } from "react-router-dom"

export function Header() {

    const { session, logout } = useSession()
    const navigate = useNavigate();

    return (
        <header className="bg-background flex flex-row w-100">
            <p>EP miro-copy</p>
            {session && (<div>{session.username} <Button onClick={logout}>Log out</Button></div>)}
            {!session && <Button onClick={() => navigate(ROUTES.LOGIN)}>Log in</Button>}
        </header>
    )
}