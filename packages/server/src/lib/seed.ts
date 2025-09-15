import { PrismaClient } from "@gridcollect/prisma";
import { type Game } from "./seed-types";
import { fetchIGDB, getClient } from "./igdb";
import { fetchData, storeData } from "./utils";

async function seed() {
  const prisma = new PrismaClient();
  const client = await getClient();

  console.log("Started seeding...");
  const games = await fetchIGDB<Game>("/games", client, {
    fields: "game",
    where: [
      "rating != null",
      "cover != null",
      "total_rating_count > 50",
      "parent_game = null",
    ],
    customLimit: 3000,
    delayMs: 350,
  });

  const dlcs = await fetchIGDB<Game>("/games", client, {
    fields: "game",
    ids: [...new Set<number>(games.flatMap((g) => g.dlcs || []))],
  });

  const allGames = games.concat(dlcs);

  const data = await fetchData(client, allGames);
  await storeData({ ...data, games: allGames }, prisma);

  for (const game of allGames) {
    try {
      const coverData = data.covers.find((v) => v.id === game.cover);

      if (!coverData) continue;
      await prisma.img.upsert({
        where: { igdbId: coverData.id },
        update: {},
        create: {
          igdbId: coverData.id,
          url: coverData.url,
        },
      });
      const gameInvolvedCompanies = data.involvedCompanies.filter((ic) => {
        if (!game.involved_companies) return false;
        return game.involved_companies.includes(ic.id);
      });

      const queryData: any = {
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
          connectOrCreate: (game.screenshots || [])
            .map((s) => {
              const ss = data.screenshots.find((v) => v.id === s);
              if (!ss) return;
              return {
                where: { igdbId: ss.id },
                create: {
                  igdbId: ss.id,
                  imageId: ss.image_id,
                  url: ss.url,
                },
              };
            })
            .filter(Boolean),
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
      };
      await prisma.game.upsert({
        where: { igdbId: game.id },
        update: queryData,
        create: queryData,
      });

      if (game.age_ratings) {
        const aRatings = data.ageRatings.filter((a) =>
          game.age_ratings.includes(a.id),
        );

        for (const rating of aRatings) {
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
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  console.log("Finished seeding.");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
