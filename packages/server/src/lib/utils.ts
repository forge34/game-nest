import { PrismaClient } from "../../generated/prisma";
import { fetchIGDB } from "./igdb";
import {
  AgeRating,
  Artwork,
  Company,
  Cover,
  Game,
  GameMode,
  Genres,
  InvolvedCompany,
  Platforms,
  Screenshot,
} from "./seed-types";
import igdb from "igdb-api-node";

export function generateIds(games: Game[]) {
  const genreIds = new Set<number>(games.flatMap((g) => g.genres || []));
  const platformIds = new Set<number>(games.flatMap((g) => g.platforms || []));
  const screenshotIds = new Set<number>(
    games.flatMap((g) => g.screenshots || []),
  );
  const coverIds = new Set<number>(games.map((g) => g.cover).filter(Boolean));
  const artworkIds = new Set<number>(games.flatMap((g) => g.artworks || []));
  const gameModeIds = new Set<number>(games.flatMap((g) => g.game_modes || []));
  const involvedCompanyIds = new Set<number>(
    games.flatMap((g) => g.involved_companies || []),
  );
  const dlcIds = new Set<number>(games.flatMap((g) => g.dlcs || []));
  const ageRatingIds = new Set<number>(
    games.flatMap((g) => g.age_ratings || []),
  );

  return {
    genreIds,
    platformIds,
    screenshotIds,
    coverIds,
    artworkIds,
    gameModeIds,
    involvedCompanyIds,
    dlcIds,
    ageRatingIds,
  };
}

export async function fetchData(
  client: ReturnType<typeof igdb>,
  games: Game[],
) {
  const {
    genreIds,
    platformIds,
    screenshotIds,
    artworkIds,
    gameModeIds,
    ageRatingIds,
    involvedCompanyIds,
    coverIds,
  } = generateIds(games);

  const [
    genres,
    platforms,
    screenshots,
    artworks,
    gameModes,
    involvedCompanies,
    ageRatings,
    covers,
  ] = [
    await fetchIGDB<Genres>("/genres", client, {
      fields: "genre",
      ids: [...genreIds],
    }),
    await fetchIGDB<Platforms>("/platforms", client, {
      fields: "platform",
      ids: [...platformIds],
    }),
    await fetchIGDB<Screenshot>("/screenshots", client, {
      fields: "screenshot",
      ids: [...screenshotIds],
    }),
    await fetchIGDB<Artwork>("/artworks", client, {
      fields: "artwork",
      ids: [...artworkIds],
    }),
    await fetchIGDB<GameMode>("/game_modes", client, {
      fields: "gameMode",
      ids: [...gameModeIds],
    }),
    await fetchIGDB<InvolvedCompany>("/involved_companies", client, {
      fields: "involvedCompany",
      ids: [...involvedCompanyIds],
    }),
    await fetchIGDB<AgeRating>("/age_ratings", client, {
      fields: "ageRating",
      ids: [...ageRatingIds],
    }),
    await fetchIGDB<Cover>("/covers", client, {
      fields: "cover",
      ids: [...coverIds],
    }),
  ];
  const companyIds = new Set<number>(
    involvedCompanies.map((ic) => ic.company).filter(Boolean),
  );
  const companies = await fetchIGDB<Company>("/companies", client, {
    fields: "company",
    ids: [...companyIds],
  });
  return {
    genres,
    platforms,
    screenshots,
    artworks,
    gameModes,
    involvedCompanies,
    ageRatings,
    covers,
    companies,
  };
}

export async function storeData(
  data: Awaited<ReturnType<typeof fetchData>> & { games: Game[] },
  prisma: PrismaClient,
) {
  const {
    genres,
    platforms,
    artworks,
    gameModes,
    companies,
  } = data;
  await prisma.$transaction([
    ...genres.map((g) => {
      return prisma.genre.upsert({
        where: { igdbId: g.id },
        update: {},
        create: {
          igdbId: g.id,
          name: g.name,
          slug: g.slug,
        },
      });
    }),
    ...platforms.map((p) => {
      return prisma.platform.upsert({
        where: { igdbId: p.id },
        update: {},
        create: {
          igdbId: p.id,
          name: p.name,
          slug: p.slug,
        },
      });
    }),
    ...companies.map((c) => {
      return prisma.company.upsert({
        where: { igdbId: c.id },
        update: {},
        create: {
          igdbId: c.id,
          name: c.name,
          description: c.description || null,
        },
      });
    }),
    ...gameModes.map((gm) => {
      return prisma.gameMode.upsert({
        where: { igdbId: gm.id },
        update: {},
        create: {
          igdbId: gm.id,
          name: gm.name,
          slug: gm.slug,
        },
      });
    }),
    ...artworks.map((a) => {
      return prisma.img.upsert({
        where: { igdbId: a.id },
        update: {},
        create: {
          igdbId: a.id,
          url: a.url,
        },
      });
    }),
    ...data.games.map((game) => {
      return prisma.game.upsert({
        where: { igdbId: game.id },
        update: {},
        create: {
          igdbId: game.id,
          title: game.name,
          slug: game.slug,
          summary: game.summary,
          storyline: game.storyline,
          rating: game.rating,
          releaseDate: game.first_release_date
            ? new Date(game.first_release_date * 1000)
            : new Date(),
        },
      });
    }),
  ]);
}
