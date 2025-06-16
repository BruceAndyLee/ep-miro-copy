// this is here because session is not supposed to change very often

import { useState } from "react"
import { jwtDecode } from "jwt-decode"
import { createGStore } from "create-gstore";

type Session = {
  userId: string,
  username: string,
  exp: number,
  iat: number, // issued at
}

const ACCESS_TOKEN_STORAGE_KEY = "access_token";

// unless you use GStore (or some other type of store manager)
// this hook/composable won't be registered globally (as a singleton)
export const useSession = createGStore(() => {

  const [token, setToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY))

  const login = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    setToken(token);
  }

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    setToken(null)
  }

  // to get the current user
  const session = token ? jwtDecode<Session>(token) : null;

  return { login, logout, session, token }
})