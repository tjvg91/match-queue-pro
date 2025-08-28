CREATE TABLE "user" (
  "id" uuid PRIMARY KEY,
  "username" text UNIQUE,
  "player_code" uuid UNIQUE,
  "email" text,
  "sex" text,
  "password" text,
  "verified" text,
  "created_at" timestamp
);

CREATE TABLE "user_group" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "group_id" uuid,
  "created_at" timestamp
);

CREATE TABLE "group" (
  "id" uuid PRIMARY KEY,
  "name" text,
  "level_category" text,
  "managed_by" text,
  "last_played" timestamp,
  "created_at" timestamp
);

CREATE TABLE "level_category" (
  "id" uuid PRIMARY KEY,
  "name" text
);

CREATE TABLE "level" (
  "id" uuid PRIMARY KEY,
  "level_category_id" uuid,
  "name" text,
  "level" integer,
  "created_at" timestamp
);

CREATE TABLE "user_level" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "level_category_id" uuid,
  "level_id" uuid
);

CREATE TABLE "schedule" (
  "id" uuid PRIMARY KEY,
  "group_id" text,
  "started" bit,
  "ended" bit,
  "created_at" timestamp
);

CREATE TABLE "court" (
  "id" uuid PRIMARY KEY,
  "number" text,
  "schedule_id" uuid,
  "created_at" timestamp
);

CREATE TABLE "match" (
  "id" uuid PRIMARY KEY,
  "court_id" uuid,
  "ended" bit,
  "created_at" timestamp
);

CREATE TABLE "partner" (
  "id" uuid PRIMARY KEY,
  "match_id" uuid,
  "score" integer,
  "result" integer,
  "created_at" timestamp
);

CREATE TABLE "user_partner" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "partner_id" uuid,
  "created_at" timestamp
);

CREATE TABLE "user_schedule" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid,
  "order" integer,
  "game_count" text,
  "schedule_id" uuid,
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
