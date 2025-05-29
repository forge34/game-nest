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
      body: `fields id,name,summary,first_release_date,cover.url,genres,platforms;
      sort popularity desc;
      where rating != null & cover != null;
      limit 30;`,
    });
    if (res.status == 401) {
      console.log("Throwing");
      throw new Error(res.statusText);
    }

    return res.json();
  } catch (e) {
    console.log(e);
    console.log("Exiting");
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
      body: `fields name , slug;where id = ( ${ids.join(",")} );`,
    });
    if (res.status == 401) {
      console.log("Throwing");
      throw new Error(res.statusText);
    }

    const genres = (await res.json()) as FetchedGenres[];

    return genres;
  } catch (e) {
    console.log(e);
    console.log("Exiting");
    process.exit(1);
  }
}

async function fetchPlatforms(token: string, ids: number[]) {
  try {
    let res = await fetch("https://api.igdb.com/v4/platforms/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields name , slug, abbreviation;where id = ( ${ids.join(",")} );`,
    });
    if (res.status == 401) {
      console.log("Throwing");
      throw new Error(res.statusText);
    }

    const platofrms = (await res.json()) as FetchedPlatforms[];
    return platofrms;
  } catch (e) {
    console.log(e);
    console.log("Exiting");
    process.exit(1);
  }
}

async function fetchCovers(token: string, id: number) {
  try {
    let res = await fetch("https://api.igdb.com/v4/covers/", {
      method: "POST",
      headers: {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields height,width,url;where id = ${id};`,
    });
    if (res.status == 401) {
      console.log("Throwing");
      throw new Error(res.statusText);
    }

    const cover = (await res.json())[0] as FetchedCover;

    return cover;
  } catch (e) {
    console.log(e);
    console.log("Exiting");
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
    const genres = (await fetchGenres(token, game.genres)).flat(1);
    const platforms = (await fetchPlatforms(token, game.platforms)).flat(1);
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
          connectOrCreate: genres.map((genre) => {
            return {
              create: {
                igdbId: genre.id,
                name: genre.name,
                slug: genre.slug,
              },
              where: {
                igdbId: genre.id,
              },
            };
          }),
        },
        platforms: {
          connectOrCreate: platforms.map((platform) => {
            return {
              create: {
                igdbId: platform.id,
                abbreviation: platform.abbreviation,
                slug: platform.slug,
                name: platform.name,
              },
              where: {
                igdbId: platform.id,
              },
            };
          }),
        },
      },
    });
  }
  console.log("Finished seeding");
  await prisma.$disconnect();
}

seed();
