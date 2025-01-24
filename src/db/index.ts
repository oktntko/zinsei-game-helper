import { PGlite } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

const client = new PGlite('idb://zinsei-game-helper');
export const db = drizzle({ client, schema, logger: true });

for (const statement of [
  sql`CREATE TABLE IF NOT EXISTS "game" (
	"game_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(40) NOT NULL,
	"description" varchar(100) NOT NULL,
	"sannka_ninnzuu" integer NOT NULL,
	"step" integer NOT NULL,
	"first_point" integer NOT NULL,
	"roll" integer NOT NULL,
	"enable_syakkinn_yakusoku_tegata" boolean DEFAULT true NOT NULL,
	"yakusoku_tegata" integer DEFAULT 20000 NOT NULL,
	"enable_syokugyou" boolean DEFAULT true NOT NULL,
	"enable_marry" boolean DEFAULT true NOT NULL,
	"enable_items" boolean DEFAULT true NOT NULL,
	"enable_myhome" boolean DEFAULT true NOT NULL,
	"enable_kabukenn" boolean DEFAULT true NOT NULL,
	"enable_hokenn_syoukenn" boolean DEFAULT true NOT NULL
);
`,
  sql`CREATE TABLE IF NOT EXISTS "player" (
	"player_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"name" varchar(40) DEFAULT '' NOT NULL,
	"color" varchar(40) DEFAULT '' NOT NULL,
	"image" varchar(100) DEFAULT '' NOT NULL,
	"point" integer DEFAULT 0 NOT NULL,
	"yakusoku_tegata" integer DEFAULT 0 NOT NULL,
	"sokugyou" varchar(40) DEFAULT '' NOT NULL,
	"kyuuryou" integer DEFAULT 0 NOT NULL,
	"is_married" boolean DEFAULT false NOT NULL,
	"children" integer DEFAULT 0 NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb,
	"myhome" jsonb DEFAULT '{"name":"","value":0}'::jsonb,
	"kabukenn" integer DEFAULT 0 NOT NULL,
	"seimei_hokenn" boolean DEFAULT false NOT NULL,
	"kasai_hokenn" boolean DEFAULT false NOT NULL,
	"zidousya_hokenn" boolean DEFAULT false NOT NULL
);
`,

  sql`ALTER TABLE "player" DROP CONSTRAINT IF EXISTS "player_game_id_game_game_id_fk";`,
  sql`
ALTER TABLE "player" ADD CONSTRAINT "player_game_id_game_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("game_id") ON DELETE no action ON UPDATE no action;
`,
]) {
  await db.execute(statement);
}
