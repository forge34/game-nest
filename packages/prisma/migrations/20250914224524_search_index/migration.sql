create index title_idx ON "Game" using GIN (to_tsvector('english' , "title"));
