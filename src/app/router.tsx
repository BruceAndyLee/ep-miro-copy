import { createBrowserRouter, redirect } from "react-router-dom";
import { App } from "./app";
import { ROUTES } from "@/shared/model/routes";
import { Providers } from "./providers";
import { Header } from "@/features/header";
import { ProtectedLoader, ProtectedOutlet } from "./protected-outlet";

export const router = createBrowserRouter([
    {
        element: (
            <Providers>
                <App />
            </Providers>
        ),
        children: [
            {
                // why is it not a jsx-like component but a function?..
                // loaders are initiated BEFORE any of the react is rendered
                // so the msw init logic is not yet run when this loader is evaluated.
                // THUS, the mock-init logic must be run both from app.tsx and from the ProtectedLoader function
                loader: ProtectedLoader,
                element: (
                    <>
                        <Header />
                        <ProtectedOutlet />
                    </>
                ),
                children: [
                    {
                        path: ROUTES.BOARDS,
                        lazy: () => import("@/features/boards-list/boards-list.page"),
                    },
                    {
                        path: ROUTES.BOARD,
                        lazy: () => import("@/features/board/board.page"),
                    },
                ]
            },
            {
                path: ROUTES.LOGIN,
                lazy: () => import("@/features/auth/login.page"),
            },
            {
                path: ROUTES.REGISTER,
                lazy: () => import("@/features/auth/register.page"),
            },
            {
                path: ROUTES.HOME,
                loader: () => redirect(ROUTES.BOARDS)
            },
        ],
    }
])