CREATE TABLE "user" (
  "id" varchar PRIMARY KEY,
  "username" varchar,
  "email" varchar,
  "sex" varchar,
  "password" varchar,
  "verified" varchar,
  "created_at" timestamp
);

CREATE TABLE "user_group" (
  "id" varchar PRIMARY KEY,
  "user_id" varchar,
  "group_id" varchar,
  "created_at" timestamp
);

CREATE TABLE "group" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "level_category" varchar,
  "managed_by" varchar,
  "last_played" timestamp,
  "created_at" timestamp
);

CREATE TABLE "level_category" (
  "id" varchar PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "level" (
  "id" varchar PRIMARY KEY,
  "level_category_id" varchar,
  "name" varchar,
  "level" integer,
  "created_at" timestamp
);

CREATE TABLE "user_level" (
  "id" varchar PRIMARY KEY,
  "user_id" varchar,
  "level_category_id" varchar,
  "level_id" varchar
);

CREATE TABLE "schedule" (
  "id" varchar PRIMARY KEY,
  "group_id" varchar,
  "started" bit,
  "ended" bit,
  "created_at" timestamp
);

CREATE TABLE "court" (
  "id" varchar PRIMARY KEY,
  "number" varchar,
  "schedule_id" varchar,
  "created_at" timestamp
);

CREATE TABLE "match" (
  "id" varchar PRIMARY KEY,
  "court_id" varchar,
  "ended" bit,
  "created_at" timestamp
);

CREATE TABLE "partner" (
  "id" varchar PRIMARY KEY,
  "match_id" varchar,
  "score" integer,
  "result" integer,
  "created_at" timestamp
);

CREATE TABLE "user_partner" (
  "id" varchar PRIMARY KEY,
  "user_id" varchar,
  "partner_id" varchar,
  "created_at" timestamp
);

CREATE TABLE "user_schedule" (
  "id" varchar PRIMARY KEY,
  "user_id" varchar,
  "order" integer,
  "game_count" varchar,
  "schedule_id" varchar,
  "created_at" timestamp
);

ALTER TABLE "user_group" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_group" ADD FOREIGN KEY ("group_id") REFERENCES "group" ("id");

ALTER TABLE "court" ADD FOREIGN KEY ("schedule_id") REFERENCES "schedule" ("id");

ALTER TABLE "match" ADD FOREIGN KEY ("court_id") REFERENCES "court" ("id");

ALTER TABLE "partner" ADD FOREIGN KEY ("match_id") REFERENCES "match" ("id");

ALTER TABLE "user_partner" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_partner" ADD FOREIGN KEY ("partner_id") REFERENCES "partner" ("id");

ALTER TABLE "user_schedule" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_schedule" ADD FOREIGN KEY ("schedule_id") REFERENCES "schedule" ("id");

ALTER TABLE "user_level" ADD FOREIGN KEY ("level_category_id") REFERENCES "level_category" ("id");

ALTER TABLE "user_level" ADD FOREIGN KEY ("level_id") REFERENCES "level" ("id");
