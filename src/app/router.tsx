import { createBrowserRouter, redirect } from "react-router-dom";
import { App } from "./app";
import { ROUTES } from "@/shared/model/routes";
import { Providers } from "./providers";
import { Header } from "@/features/header";
import { ProtectedOutlet } from "./protected-outlet";

export const router = createBrowserRouter([
    {
        element: (
            <Providers>
                <App />
            </Providers>
        ),
        children: [
            {
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