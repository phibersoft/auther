CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "username" varchar(30) NOT NULL UNIQUE,
  "email" varchar(60) NOT NULL UNIQUE,
  "password" varchar(200) NOT NULL,
  "avatar" varchar(600),
  "active" boolean DEFAULT true
);
