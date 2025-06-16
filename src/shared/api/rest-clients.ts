import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths as REST } from "./schema/generated";
import { CONFIG } from "@/shared/model/config";
import { useSession } from "../model/use-session";
import type { ApiComponents } from "./schema";


// introducing 2 different clients:
// - one with added middleware for requests that need authorization
// - one without any middleware for login, register and other public api querying
export const fetchClient = createFetchClient<REST>({
    baseUrl: CONFIG.API_BASE_URL,
});

export const rqClient = createClient(fetchClient);

fetchClient.use({
    async onRequest({ request }) {
        
        // if we were to update the token separately each time it expires
        // we'd get it directly from the store-facade
        // const { token } = useSession.getState();
        // but we'd like to also make sure that the accessToken we're getting
        // is up to date and has not by chance expired
        const token = await useSession.getState().refreshToken()

        if (token) {
            // this is some conventional stuff from how authorization is added to headers
            request.headers.set("Authorization", `Bearer ${token}`)
        } else {
            // this code literally interjects browser-api the same way as service-worker in msw
            return new Response(
                JSON.stringify({ code: "NOT_AUTHORIZED" } as ApiComponents["schemas"]["Error"]),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
    }
})


export const publicFetchClient = createFetchClient<REST>({
    baseUrl: CONFIG.API_BASE_URL,
});
export const publicrqClient = createClient(publicFetchClient);

// fetchClient.GET("/boards").then(res => {
//     if (res.data) {
//         res.data.map((board) => board.name)
//     }

//     // if (res.error) {
//     // }
// })
// fetchClient.POST("/boards", {
//     body: {
//         name: "lol"
//     },
// })


// /** using reactQuery */
// const boardsRes = rqClient.useQuery("get", "/boards")
// boardsRes.data?.map((board) => board.name)