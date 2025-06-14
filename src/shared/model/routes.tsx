import "react-router-dom"

// ? нет смысла упарываться в декомпозицию
// это статическая декларативная информация, очень однотипная
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    BOARDS: "/boards",
    BOARD: "/board/:boardId",
} as const;

// активируется и делается доступным на весь проект ниже при декларации модуля
// нужен для того, чтобы редиректы были типизированными
export type PathParams = {
    [ROUTES.BOARD]: {
        boardId: string,
    } 
}

declare module "react-router-dom" {
    // Register - интерфейс, предоставляемый библиотекой react-router-dom
    // для переопределения путей и их параметров при декларации url-структуры проекта
    interface Register {
        params: PathParams;
    }
}