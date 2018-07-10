DROP DATABASE IF EXISTS "users-app-db";
DROP DATABASE IF EXISTS "users-app-db-test";

CREATE DATABASE "users-app-db";
CREATE DATABASE "users-app-db-test";

\c "users-app-db"

CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);

-- psql < schema.sql