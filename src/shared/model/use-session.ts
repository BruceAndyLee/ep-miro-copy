// this is here because session is not supposed to change very often

import { useState } from "react"
import { jwtDecode } from "jwt-decode"
import { createGStore } from "create-gstore";
import { publicFetchClient, publicrqClient } from "../api/rest-clients";

type Session = {
  userId: string,
  username: string,
  exp: number,
  iat: number, // issued at
}

const ACCESS_TOKEN_STORAGE_KEY = "access_token";

let refreshTokenPromise: Promise<string | null> | null = null;

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

  // this is a stinky way to refresh
  // because multiple calls to refresh token will issue multiple requests to server
  // a better alternative is below and features a singleton-ish promise
  const refreshTokenBad = async () => {
    if (!session) {
      return null;
    }

    if (session.exp < Date.now() + 10) {
      const newRefreshToken = await publicFetchClient.POST("/auth/refresh").then((r) => r.data?.accessToken ?? null);

      if (newRefreshToken) {
        login(newRefreshToken)
        return newRefreshToken;
      } else {
        logout()
      }
    }
  }

  /**
   * Eventually, this function makes sense to be called from
   * the middleware of the client that takes care of the auth-header in all responses
   * @returns 
   */
  const refreshToken = async () => {
    if (!session) {
      return null;
    }

    if (session.exp < Date.now() + 10) {

      if (!refreshTokenPromise) {
        refreshTokenPromise = publicFetchClient
          .POST("/auth/refresh") // post body is empty, since the refresh-token is stored in the cookies
          .then((resp) => resp.data?.accessToken ?? null)
          .then((newRefreshToken) => {

            // login/logout is carried out inside that singleton-ish promise
            // bc otherwise all the functions that may have subscribed to that promise
            // will run the same update on localStorage
            if (newRefreshToken) {
              login(newRefreshToken)
              return newRefreshToken;
            }
            logout()
            return null;
          })
          .finally(() => {
            refreshTokenPromise = null;
          })
      }

      return await refreshTokenPromise;
    }
  }

  // to get the current user
  const session = token ? jwtDecode<Session>(token) : null;

  return { login, logout, refreshToken, session, token }
})