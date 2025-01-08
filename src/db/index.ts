import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

const client = new PGlite('idb://zinsei-game-helper');
export const db = drizzle({ client, schema });

for (const statement of [
  sql`CREATE TABLE IF NOT EXISTS "_PlayerToItem" (
	"player_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	CONSTRAINT "_PlayerToItem_player_id_item_id_pk" PRIMARY KEY("player_id","item_id")
);
`,
  sql`CREATE TABLE IF NOT EXISTS "game" (
	"game_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(20) NOT NULL,
	"description" varchar(100) DEFAULT '' NOT NULL,
	"players" integer NOT NULL,
	"initial_money" integer NOT NULL,
	"roll" integer NOT NULL
);
`,
  sql`CREATE TABLE IF NOT EXISTS "item" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"name" varchar(20) NOT NULL,
	"description" varchar(100) DEFAULT '' NOT NULL,
	"value" integer NOT NULL
);
`,
  sql`CREATE TABLE IF NOT EXISTS "job" (
	"job_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"name" varchar(20) NOT NULL,
	"description" varchar(100) DEFAULT '' NOT NULL,
	"salary" integer NOT NULL
);
`,
  sql`CREATE TABLE IF NOT EXISTS "player" (
	"player_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"job_id" uuid,
	"name" varchar(20) NOT NULL,
	"color" varchar(10) NOT NULL,
	"image" varchar(100) NOT NULL,
	"money" integer NOT NULL
);
`,

  sql`ALTER TABLE "_PlayerToItem" DROP CONSTRAINT IF EXISTS "_PlayerToItem_player_id_player_player_id_fk";`,
  sql`
ALTER TABLE "_PlayerToItem" ADD CONSTRAINT "_PlayerToItem_player_id_player_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("player_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
  `,

  sql`ALTER TABLE "_PlayerToItem" DROP CONSTRAINT IF EXISTS "_PlayerToItem_item_id_item_item_id_fk";`,
  sql`
ALTER TABLE "_PlayerToItem" ADD CONSTRAINT "_PlayerToItem_item_id_item_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
  `,

  sql`ALTER TABLE "item" DROP CONSTRAINT IF EXISTS "item_game_id_game_game_id_fk";`,
  sql`
ALTER TABLE "item" ADD CONSTRAINT "item_game_id_game_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("game_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
  `,

  sql`ALTER TABLE "job" DROP CONSTRAINT IF EXISTS "job_game_id_game_game_id_fk";`,
  sql`
ALTER TABLE "job" ADD CONSTRAINT "job_game_id_game_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("game_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
  `,

  sql`ALTER TABLE "player" DROP CONSTRAINT IF EXISTS "player_game_id_game_game_id_fk";`,
  sql`
ALTER TABLE "player" ADD CONSTRAINT "player_game_id_game_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("game_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
  `,

  sql`ALTER TABLE "player" DROP CONSTRAINT IF EXISTS "player_job_id_job_job_id_fk";`,
  sql`
ALTER TABLE "player" ADD CONSTRAINT "player_job_id_job_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("job_id") ON DELETE no action ON UPDATE no action;  `,
]) {
  await db.execute(statement);
}
