import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths as REST } from "./schema/generated";
import { CONFIG } from "@/shared/model/config";

export const fetchClient = createFetchClient<REST>({
    baseUrl: CONFIG.API_BASE_URL,
});

export const rqClient = createClient(fetchClient);

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