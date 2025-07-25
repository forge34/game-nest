import { PrismaClient } from "../../generated/prisma";
import {
  type Game,
  type AgeRating,
  type InvolvedCompany,
  type Artwork,
  type Company,
  type Cover,
  type GameMode,
  type Genres,
  type Platforms,
  type Screenshot,
  IGDB_FIELDS,
} from "./seed-types";
import { fetchIGDB, getClient } from "./igdb";

function generateIds(games: Game[]) {
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

async function seed() {
  const prisma = new PrismaClient();
  const client = await getClient();
  //
  // const games = (
  //   await client
  //     .fields(IGDB_FIELDS["game"])
  //     .where(["rating != null", "cover != null", "total_rating_count > 50"])
  //     .limit(500)
  //     .request("/games")
  // ).data as Game[];

  console.log("Started seeding...");
  const games = await fetchIGDB<Game>("/games", client, {
    fields: "game",
    where: ["rating != null", "cover != null", "total_rating_count > 50"],
    delayMs: 350,
  });

  const dlcs = await fetchIGDB<Game>("/games", client, {
    fields: "game",
    ids: [...new Set<number>(games.flatMap((g) => g.dlcs || []))],
  });

  const {
    genreIds,
    platformIds,
    screenshotIds,
    artworkIds,
    gameModeIds,
    ageRatingIds,
    involvedCompanyIds,
    coverIds,
  } = generateIds([...new Set(games.concat(dlcs))]);
  const [
    genres,
    platforms,
    screenshots,
    artworks,
    gameModes,
    involvedCompanies,
    ageRatings,
    covers,
  ] = await Promise.all([
    fetchIGDB<Genres>("/genres", client, {
      fields: "genre",
      ids: [...genreIds],
    }),
    fetchIGDB<Platforms>("/platforms", client, {
      fields: "platform",
      ids: [...platformIds],
    }),
    fetchIGDB<Screenshot>("/screenshots", client, {
      fields: "screenshot",
      ids: [...screenshotIds],
    }),
    fetchIGDB<Artwork>("/artworks", client, {
      fields: "artwork",
      ids: [...artworkIds],
    }),
    fetchIGDB<GameMode>("/game_modes", client, {
      fields: "gameMode",
      ids: [...gameModeIds],
    }),
    fetchIGDB<InvolvedCompany>("/involved_companies", client, {
      fields: "involvedCompany",
      ids: [...involvedCompanyIds],
    }),
    fetchIGDB<AgeRating>("/age_ratings", client, {
      fields: "ageRating",
      ids: [...ageRatingIds],
    }),
    fetchIGDB<Cover>("/covers", client, {
      fields: "cover",
      ids: [...coverIds],
    }),
  ]);

  const companyIds = new Set<number>(
    involvedCompanies.map((ic) => ic.company).filter(Boolean),
  );
  const companies = await fetchIGDB<Company>("/companies", client, {
    fields: "company",
    ids: [...companyIds],
  });

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
    ...dlcs.map((game) => {
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

  for (const game of games.concat(dlcs)) {
    console.log("Inserting game #" + game.id);
    const coverData = covers.find((v) => v.id === game.cover);

    if (!coverData) continue;
    await prisma.img.upsert({
      where: { igdbId: coverData.id },
      update: {},
      create: {
        igdbId: coverData.id,
        url: coverData.url,
      },
    });
    const gameInvolvedCompanies = involvedCompanies.filter((ic) => {
      if (!game.involved_companies) return false;
      return game.involved_companies.includes(ic.id);
    });

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
        releaseDate: game.first_release_date
          ? new Date(game.first_release_date * 1000)
          : new Date(),
        parent_game: game.parent_game
          ? {
              connect: { igdbId: game.parent_game },
            }
          : undefined,

        coverImage: {
          connect: {
            igdbId: coverData.id,
          },
        },
        genres: {
          connect: (game.genres || []).map((g) => ({ igdbId: g })),
        },
        platforms: {
          connect: (game.platforms || []).map((p) => ({
            igdbId: p,
          })),
        },

        screenshots: {
          connectOrCreate: (game.screenshots || []).map((s) => {
            const ss = screenshots.find((v) => v.id === s);
            return {
              where: { igdbId: ss.id },
              create: {
                igdbId: ss.id,
                imageId: ss.image_id,
                url: ss.url,
              },
            };
          }),
        },

        developer: {
          connect: gameInvolvedCompanies
            .filter((ic) => ic.developer && ic.company)
            .map((ic) => ({ igdbId: ic.company })),
        },
        publisher: {
          connect: gameInvolvedCompanies
            .filter((ic) => ic.publisher && ic.company)
            .map((ic) => ({ igdbId: ic.company })),
        },
        artworks: {
          connect: game.artworks?.map((a) => ({ igdbId: a })),
        },
        gameModes: {
          connect: (game.game_modes || []).map((g) => ({ igdbId: g })),
        },
        dlcs: {
          connect: (game.dlcs || []).map((d) => ({ igdbId: d })),
        },
      },
    });

    if (game.age_ratings) {
      const aRatings = ageRatings.filter((a) =>
        game.age_ratings.includes(a.id),
      );

      for (const rating of aRatings) {
        await prisma.ageRating.upsert({
          where: { igdbId: rating.id },
          update: {},
          create: {
            igdbId: rating.id,
            game: { connect: { igdbId: game.id } }, // relies on unique igdbId
            organization: rating.organization,
            ratingCategory: rating.rating_category,
            synopsis: rating.synopsis || null,
            ratingCoverUrl: rating.rating_cover_url || null,
          },
        });
      }
    }
  }

  console.log("Finished seeding.");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
