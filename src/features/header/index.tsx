import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/use-session"
import { Button } from "@/shared/ui/kit/button"
import { useNavigate } from "react-router-dom"

export function Header() {

    const { session, logout } = useSession()
    const navigate = useNavigate();

    // otherwise the header shows for a split second before the UI is redirected to login
    if (!session)
        return null;

    return (
        <header className="bg-background flex flex-row w-100">
            <p>EP miro-copy</p>
            {session && (<div>{session.username} <Button onClick={logout}>Log out</Button></div>)}
            {!session && <Button onClick={() => navigate(ROUTES.LOGIN)}>Log in</Button>}
        </header>
    )
}