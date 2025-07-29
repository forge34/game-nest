import dotenv from "dotenv";
import pLimit from "p-limit";
import { AccessToken, IGDB_FIELDS } from "./seed-types";
import igdb from "igdb-api-node";

dotenv.config();

export const client_id = process.env.CLIENT_ID || "";
const client_secret = process.env.CLIENT_SECRET || "";
export const limit = pLimit(4);

export async function getAccessToken() {
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id,
      client_secret,
      grant_type: "client_credentials",
    }),
  });

  if (res.ok) {
    const token = (await res.json()) as AccessToken;
    return token;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type FetchOptions = {
  fields: keyof typeof IGDB_FIELDS;
  ids?: number[];
  customLimit?: number;
  where?: string[];
  delayMs?: number;
};

export async function fetchIGDB<T>(
  endpoint: string,
  client: ReturnType<typeof igdb>,
  opt: FetchOptions,
): Promise<T[]> {
  const IGDB_MAX_LIMIT = 500;
  const results: T[] = [];
  const { delayMs = 350, where = [], customLimit = 500, ids, fields } = opt;
  console.log(`Fetching ${fields} (total - ${ids ? ids.length : 0})`  );
  if (ids && ids.length > 0) {
    for (let i = 0; i < ids.length; i += IGDB_MAX_LIMIT) {
      const chunk = ids.slice(i, i + IGDB_MAX_LIMIT);
      const req = client.fields(IGDB_FIELDS[fields]);
      req.where([`id = (${chunk.join(",")})`, ...where]).limit(chunk.length);

      const response = await req.request(endpoint);
      results.push(...(response.data as T[]));

      console.log(
        `Fetched ${response.data.length} of ${ids.length} from chunk`,
      );
      await delay(delayMs);
    }
  } else {
    let offset = 0;
    const totalLimit = customLimit;
    while (results.length < totalLimit) {
      const remaining = totalLimit - results.length;
      const chunkSize = Math.min(IGDB_MAX_LIMIT, remaining);
      console.log(`remaining ${remaining}`);

      const req = client.fields(IGDB_FIELDS[fields]);
      req.where(where);
      req.limit(chunkSize).offset(offset);

      const response = await req.request(endpoint);
      const data = response.data as T[];

      results.push(...data);
      if (data.length < chunkSize) break;

      offset += chunkSize;
      console.log(`Fetched ${data.length} of ${chunkSize} from chunk`);
      await delay(delayMs);
    }
  }

  return results;
}

export const getClient = async () => {
  const token = (await getAccessToken())?.access_token || "";
  return igdb(client_id, token);
};
