/* eslint-disable no-fallthrough */
import { PGlite } from '@electric-sql/pglite';
import { sql, type ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { drizzle, type PgliteQueryResultHKT } from 'drizzle-orm/pglite';
import { colors, images } from '~/const';
import * as schema from './schema';

const client = new PGlite('idb://zinsei-game-helper');
export const db = drizzle({ client, schema, logger: true });

export async function $transaction<R>(
  fn: (
    tx: PgTransaction<
      PgliteQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >,
  ) => Promise<R>,
) {
  const execute = () =>
    db.transaction(fn, {
      isolationLevel: 'read committed',
      accessMode: 'read write',
      deferrable: true,
    });
  try {
    return execute();
  } catch (e) {
    // TODO データベースエラーの時だけ
    console.error(e);

    await prepareDatabase();

    return execute();
  }
}

export async function prepareDatabase() {
  try {
    if (await isLatestVersion()) {
      return;
    }
    await migrateDatabase();
  } catch {
    await initializeTables();
  }
}

// ◎ バージョンを確認する
async function isLatestVersion() {
  const migrate = await db.query.migrate.findFirst();
  const version = migrate?.version ?? '';
  return schema.CURRENT_VERSION === version;
}

export async function initializeTables() {
  await dropTables();
  await createTables();
  await seedData();
}

// ◎ テーブルを破棄する
async function dropTables() {
  for (const statement of [
    sql`DROP TABLE IF EXISTS "migrate";`,
    sql`DROP TABLE IF EXISTS "player";`,
    sql`DROP TABLE IF EXISTS "game";`,
  ]) {
    await db.execute(statement);
  }
}

// ◎ データベースを初期化する
async function createTables() {
  for (const statement of [
    sql`CREATE TABLE "game" (
	"game_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(40) NOT NULL,
	"description" varchar(100) NOT NULL,
	"roll" integer NOT NULL,
	"step" integer NOT NULL,
	"first_point" integer NOT NULL,
	"enable_syakkinn_yakusoku_tegata" boolean DEFAULT false NOT NULL,
	"yakusoku_tegata" integer DEFAULT 20000 NOT NULL,
	"enable_marry" boolean DEFAULT false NOT NULL,
	"enable_myhome" boolean DEFAULT false NOT NULL,
	"enable_kabukenn" boolean DEFAULT false NOT NULL,
	"enable_hokenn_syoukenn" boolean DEFAULT false NOT NULL
);
  `,
    sql`CREATE TABLE "player" (
	"player_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"name" varchar(40) DEFAULT '' NOT NULL,
	"color" varchar(40) DEFAULT '' NOT NULL,
	"image" varchar(100) DEFAULT '' NOT NULL,
	"point" integer DEFAULT 0 NOT NULL,
	"yakusoku_tegata" integer DEFAULT 0 NOT NULL,
	"is_married" boolean DEFAULT false NOT NULL,
	"children" integer DEFAULT 0 NOT NULL,
	"myhome" jsonb DEFAULT '{"image":"","value":0}'::jsonb,
	"kabukenn" integer DEFAULT 0 NOT NULL,
	"seimei_hokenn" boolean DEFAULT false NOT NULL,
	"kasai_hokenn" boolean DEFAULT false NOT NULL,
	"zidousya_hokenn" boolean DEFAULT false NOT NULL
);
`,
    sql`CREATE TABLE "migrate" (
	"version" varchar(40) NOT NULL
);
`,
    sql`
ALTER TABLE "player" ADD CONSTRAINT "player_game_id_game_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("game_id") ON DELETE cascade ON UPDATE no action;
`,
  ]) {
    await db.execute(statement);
  }
}
async function seedData() {
  await db.insert(schema.migrate).values({
    version: schema.CURRENT_VERSION,
  });

  // 人生ゲーム
  const [人生ゲーム] = await db
    .insert(schema.games)
    .values({
      name: 'じんせいゲーム',
      description: `100年を振り返る壮大な人生ゲームが今ここに!`,
      roll: 10,
      step: 1000,
      first_point: 5000,
      enable_syakkinn_yakusoku_tegata: true,
      yakusoku_tegata: 20000,
      enable_marry: true,
      enable_myhome: true,
      enable_kabukenn: true,
      enable_hokenn_syoukenn: true,
    })
    .returning();

  await db.insert(schema.players).values(
    ['ぼく', 'わたし', 'おとな(1)', 'おとな(2)'].map((name, order) => ({
      name,
      game_id: 人生ゲーム.game_id,
      order,
      color: colors[order].value,
      image: images[order].value,
      point: 人生ゲーム.first_point,
    })),
  );

  // ドラえもん人生ゲーム
  const [ドラえもん人生ゲーム] = await db
    .insert(schema.games)
    .values({
      name: 'ドラえもんじんせいゲーム',
      description: `ドラえもんの世界に飛び込んで夢をかなえよう!!`,
      roll: 10,
      step: 1000,
      first_point: 5000,
      enable_syakkinn_yakusoku_tegata: true,
      yakusoku_tegata: 20000,
      enable_marry: false,
      enable_myhome: false,
      enable_kabukenn: false,
      enable_hokenn_syoukenn: false,
    })
    .returning();

  await db.insert(schema.players).values(
    ['ドラえもん', 'のびた', 'しずか', 'スネお', 'ジャイアン'].map((name, order) => ({
      name,
      game_id: ドラえもん人生ゲーム.game_id,
      order,
      color: colors[order].value,
      image: images[order].value,
      point: ドラえもん人生ゲーム.first_point,
    })),
  );

  // モノポリー
  const [モノポリー] = await db
    .insert(schema.games)
    .values({
      name: 'モノポリー',
      description: `最終的に他のプレイヤーを全て破産させることを目的とする。`,
      roll: 6,
      step: 1,
      first_point: 10,
      enable_syakkinn_yakusoku_tegata: false,
      yakusoku_tegata: 0,
      enable_marry: false,
      enable_myhome: false,
      enable_kabukenn: false,
      enable_hokenn_syoukenn: false,
    })
    .returning();

  await db.insert(schema.players).values(
    ['ぼく', 'わたし', 'おとな(1)', 'おとな(2)'].map((name, order) => ({
      name,
      game_id: モノポリー.game_id,
      order,
      color: colors[order].value,
      image: images[order].value,
      point: モノポリー.first_point,
    })),
  );
}

// ◎ データベースをマイグレートする
async function migrateDatabase() {
  switch (schema.CURRENT_VERSION) {
    case '1.0.0':
    case '1.0.1':
    // '1.0.0' => '1.0.1'
    case '1.0.2':
    // '1.0.1' => '1.0.2'
  }
}
