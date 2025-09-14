SELECT title,"releaseDate",c."url" as "coverUrl"
FROM "Game" g
JOIN "Img" c on g."coverImageId" = c."id"
WHERE to_tsvector('english', "title") @@ plainto_tsquery('english', $1);
