import { PrismaClient } from "../generated/prisma";
import dotenv from "dotenv";

dotenv.config();

type FetchedGames = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  first_release_date: number;
  cover: {
    id: number;
    url: string;
  };
  coverid: number;
  genres: number[];
  platforms: number[];
};

type FetchedGenres = {
  name: string;
  slug: string;
  id: number;
};

type FetchedPlatforms = {
  name: string;
  slug: string;
  id: number;
  abbreviation: string;
  platform_logo?: number;
};

type FetchedPlatformLogo = {
  id: number;
  url: string;
};

type FetchedCover = {
  id: number;
  url: string;
  height: number;
  width: number;
};

type AccessToken = {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
};

async function getAccessToken() {
  const client_id = process.env.CLIENT_ID || "";
  const client_secret = process.env.CLIENT_SECRET || "";

  let res = await fetch("https://id.twitch.tv/oauth2/token", {
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

async function fetchGames(token: string) {
  try {
    const res = await fetch("https://api.igdb.com/v4/games/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields id,name,slug,summary,first_release_date,cover.url,genres,platforms;
      sort popularity desc;
      where rating != null & cover != null;
      limit 30;`,
    });

    if (res.status === 401) throw new Error(res.statusText);

    return res.json();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function fetchGenres(token: string, ids: number[]) {
  try {
    const res = await fetch("https://api.igdb.com/v4/genres/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields name,slug; where id = (${ids.join(",")});`,
    });

    if (res.status === 401) throw new Error(res.statusText);

    return (await res.json()) as FetchedGenres[];
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function fetchPlatforms(token: string, ids: number[]) {
  try {
    const res = await fetch("https://api.igdb.com/v4/platforms/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields name,slug,abbreviation,platform_logo; where id = (${ids.join(",")});`,
    });

    if (res.status === 401) throw new Error(res.statusText);

    return (await res.json()) as FetchedPlatforms[];
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function fetchPlatformLogo(token: string, id: number) {
  try {
    const res = await fetch("https://api.igdb.com/v4/platform_logos/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields url; where id = ${id};`,
    });

    if (res.status === 401) throw new Error(res.statusText);

    return (await res.json())[0] as FetchedPlatformLogo;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function fetchCovers(token: string, id: number) {
  try {
    const res = await fetch("https://api.igdb.com/v4/covers/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields height,width,url; where id = ${id};`,
    });

    if (res.status === 401) throw new Error(res.statusText);

    return (await res.json())[0] as FetchedCover;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function seed() {
  const token = (await getAccessToken())?.access_token || "";
  const prisma = new PrismaClient();

  const games = await fetchGames(token);

  console.log("Started seeding");
  for (const game of games) {
    console.log("Adding game with #id : " + game.id);
    const genres = await fetchGenres(token, game.genres);
    const platforms = await fetchPlatforms(token, game.platforms);
    const cover = await fetchCovers(token, game.cover.id);

    await prisma.game.upsert({
      where: { igdbId: game.id },
      update: {},
      create: {
        igdbId: game.id,
        slug: game.slug,
        title: game.name,
        summary: game.summary,
        releaseDate: new Date(game.first_release_date * 1000),
        coverImage: {
          connectOrCreate: {
            create: {
              igdbId: cover.id,
              url: cover.url,
            },
            where: {
              igdbId: cover.id,
            },
          },
        },
        genres: {
          connectOrCreate: genres.map((genre) => ({
            create: {
              igdbId: genre.id,
              name: genre.name,
              slug: genre.slug,
            },
            where: {
              igdbId: genre.id,
            },
          })),
        },
        platforms: {
          connectOrCreate: await Promise.all(
            platforms.map(async (platform) => {
              let logoUrl: string | null = null;

              if (platform.platform_logo) {
                const logo = await fetchPlatformLogo(token, platform.platform_logo);
                logoUrl = logo?.url || null;
              }

              return {
                create: {
                  igdbId: platform.id,
                  abbreviation: platform.abbreviation,
                  slug: platform.slug,
                  name: platform.name,
                  imgUrl: logoUrl,
                },
                where: {
                  igdbId: platform.id,
                },
              };
            })
          ),
        },
      },
    });
  }

  console.log("Finished seeding");
  await prisma.$disconnect();
}

seed();
