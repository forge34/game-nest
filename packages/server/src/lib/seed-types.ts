export type Genres = {
  id: number;
  name: string;
  slug: string;
};

export type Platforms = {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
  platform_logo?: number;
};

export type Artwork = {
  id: number;
  url: string;
  game: number;
  image_id?: string;
  width?: number;
  height?: number;
};

export type Cover = {
  id: number;
  url: string;
  height: number;
  width: number;
  game: number;
  image_id: string;
};

export type Screenshot = {
  id: number;
  image_id: string;
  url: string;
  game: number;
  width?: number;
  height?: number;
};

export type Company = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  country?: number;
  logo?: number;
  websites?: number[];
};

export type InvolvedCompany = {
  id: number;
  company: number;
  developer?: boolean;
  publisher?: boolean;
  game: number;
};

export type Game = {
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
  parent_game: number;
  age_ratings: number[];
  artworks: number[];
  game_modes: number[];
  screenshots: number[];
  dlcs: number[];
};

export type AgeRating = {
  id: number;
  organization: number;
  rating_category: number;
  rating_cover_url?: string;
  synopsis?: string;
  rating_content_descriptions?: number[];
};

export type GameMode = {
  id: number;
  name: string;
  slug: string;
};

export const IGDB_FIELDS = {
  game: [
    "id",
    "name",
    "slug",
    "summary",
    "storyline",
    "first_release_date",
    "rating",
    "genres",
    "platforms",
    "cover",
    "screenshots",
    "artworks",
    "involved_companies",
    "age_ratings",
    "game_modes",
    "dlcs",
    "parent_game",
  ],
  genre: ["id", "name", "slug"],
  platform: ["id", "name", "slug", "abbreviation"],
  cover: ["id", "url", "width", "height", "game", "image_id"],
  screenshot: ["id", "url", "image_id", "game", "width", "height"],
  artwork: ["id", "url", "image_id", "game", "width", "height"],
  involvedCompany: ["id", "company", "developer", "publisher", "game"],
  company: ["id", "name", "slug", "description", "country", "logo"],
  gameMode: ["id", "name", "slug"],
  ageRating: [
    "id",
    "organization",
    "rating_category",
    "rating_cover_url",
    "synopsis",
  ],
};

export type AccessToken = {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
};
