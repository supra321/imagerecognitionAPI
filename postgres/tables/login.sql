BEGIN TRANSACTION;

CREATE TABLE login (
    id serial PRIMARY KEY,
    password varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);

COMMIT;