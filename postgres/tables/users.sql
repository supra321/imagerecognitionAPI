BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    rank BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL
);

COMMIT;