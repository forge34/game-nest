import { PrismaClient } from "../generated/prisma";
import dotenv from "dotenv";
import igdb from "igdb-api-node";

dotenv.config();

const client_id = process.env.CLIENT_ID || "";
const client_secret = process.env.CLIENT_SECRET || "";

type FetchedGenres = {
  id: number;
  name: string;
  slug: string;
};

type FetchedPlatforms = {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
  platform_logo?: number;
};

type FetchedCover = {
  id: number;
  url: string;
  height: number;
  width: number;
};

type FetchedScreenshot = {
  id: number;
  image_id: string;
  url: string;
};

type FetchedCompany = {
  id: number;
  name: string;
  description?: string;
  developed?: number[];
  published?: number[];
};

type InvolvedCompany = {
  id: number;
  company: number;
  developer?: boolean;
  publisher?: boolean;
  game: number;
};

type FetchedGame = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  storyline: string;
  first_release_date: number;
  rating: number;
  cover: number;
  genres: number[];
  platforms: number[];
  involved_companies?: number[];
  age_ratings: number[];
};

type FetchedAgeRating = {
  id: number;
  organization: number;
  rating_category: number;
  rating_cover_url?: string;
  synopsis?: string;
  rating_content_descriptions?: number[];
};

type AccessToken = {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
};

async function getAccessToken() {
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

async function seed() {
  const token = (await getAccessToken())?.access_token || "";
  const prisma = new PrismaClient();
  const client = igdb(client_id, token);

  const games = (
    await client
      .fields([
        "id",
        "name",
        "slug",
        "rating",
        "summary",
        "storyline",
        "first_release_date",
        "cover",
        "genres",
        "platforms",
        "involved_companies",
        "age_ratings",
      ])
      .where(["rating != null", "cover != null", "total_rating_count > 50"])
      .limit(50)
      .request("/games")
  ).data as FetchedGame[];

  console.log("Started seeding...");

  for (const game of games) {
    console.log(`Processing: ${game.name} (#${game.id})`);

    let coverData: FetchedCover | undefined = undefined;
    if (game.cover) {
      const cover = (
        await client
          .fields(["id", "url", "width", "height"])
          .where(`id = ${game.cover}`)
          .request("/covers")
      ).data[0] as FetchedCover | undefined;

      if (!cover?.url) {
        console.log(`Skipping ${game.name} — missing cover URL`);
        continue;
      }

      coverData = cover;

      await prisma.cover.upsert({
        where: { igdbId: cover.id },
        update: {},
        create: {
          igdbId: cover.id,
          url: cover.url,
        },
      });
    } else {
      console.log(`Skipping ${game.name} — no cover ID`);
      continue;
    }

    let genres: FetchedGenres[] = [];
    if (game.genres?.length) {
      genres = (
        await client
          .fields(["id", "name", "slug"])
          .where(`id = (${game.genres.join(",")})`)
          .request("/genres")
      ).data as FetchedGenres[];

      for (const genre of genres) {
        await prisma.genre.upsert({
          where: { igdbId: genre.id },
          update: {},
          create: {
            igdbId: genre.id,
            name: genre.name,
            slug: genre.slug,
          },
        });
      }
    }

    let platforms: FetchedPlatforms[] = [];
    if (game.platforms?.length) {
      platforms = (
        await client
          .fields(["id", "name", "slug", "abbreviation", "platform_logo"])
          .where(`id = (${game.platforms.join(",")})`)
          .request("/platforms")
      ).data as FetchedPlatforms[];

      for (const platform of platforms) {
        await prisma.platform.upsert({
          where: { igdbId: platform.id },
          update: {},
          create: {
            igdbId: platform.id,
            name: platform.name,
            slug: platform.slug,
            abbreviation: platform.abbreviation,
          },
        });
      }
    }

    const screenshots = (
      await client
        .fields(["id", "image_id", "url"])
        .where(`game = ${game.id}`)
        .limit(10)
        .request("/screenshots")
    ).data as FetchedScreenshot[];

    const involvedCompanies = (
      await client
        .fields(["id", "company", "developer", "publisher", "game"])
        .where(`id = (${(game.involved_companies || []).join(",")})`)
        .request("/involved_companies")
    ).data as InvolvedCompany[];

    for (const involved of involvedCompanies) {
      const company = (
        await client
          .fields(["id", "name", "description", "developed", "published"])
          .where(`id = ${involved.company}`)
          .request("/companies")
      ).data[0] as FetchedCompany;

      await prisma.company.upsert({
        where: { igdbId: company.id },
        update: {},
        create: {
          igdbId: company.id,
          name: company.name,
          description: company.description || null,
        },
      });
    }

    await prisma.game.upsert({
      where: { igdbId: game.id },
      update: {},
      create: {
        igdbId: game.id,
        title: game.name,
        slug: game.slug,
        summary: game.summary,
        storyline: game.storyline,
        rating: game.rating,
        releaseDate: new Date(game.first_release_date * 1000),
        coverImage: { connect: { igdbId: coverData.id } },
        genres: {
          connect: genres.map((g) => ({ igdbId: g.id })),
        },
        platforms: {
          connect: platforms.map((p) => ({ igdbId: p.id })),
        },
        screenshots: {
          create: screenshots.map((s) => ({
            igbdId: s.id,
            imageId: s.image_id,
            url: s.url,
          })),
        },
        developer: {
          connect: involvedCompanies
            .filter((i) => i.developer)
            .map((i) => ({ igdbId: i.company })),
        },
        publisher: {
          connect: involvedCompanies
            .filter((i) => i.publisher)
            .map((i) => ({ igdbId: i.company })),
        },
      },
    });

    if (game.age_ratings?.length) {
      const ratings = (
        await client
          .fields([
            "id",
            "organization",
            "rating_category",
            "rating_cover_url",
            "synopsis",
          ])
          .where(`id = (${game.age_ratings.join(",")})`)
          .request("/age_ratings")
      ).data as FetchedAgeRating[];

      for (const rating of ratings) {
        await prisma.ageRating.upsert({
          where: { igdbId: rating.id },
          update: {},
          create: {
            igdbId: rating.id,
            game: { connect: { igdbId: game.id } },
            organization: rating.organization,
            ratingCategory: rating.rating_category,
            synopsis: rating.synopsis || null,
            ratingCoverUrl: rating.rating_cover_url || null,
          },
        });
      }
    }
    console.log(`Inserted: ${game.name}`);
  }

  console.log("Finished seeding.");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
