import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const CURRENT_VERSION: string = '1.0.0';

export const games = pgTable('game', {
  game_id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 40 }).notNull(), /// ゲームの名前
  description: varchar({ length: 100 }).notNull(), /// ゲームの説明

  roll: integer().notNull(), /// 出目
  step: integer().notNull(), /// 最小ポイントの増加/減少単位
  first_point: integer().notNull(), /// ゲーム開始時点のポイント
  /// ゲームシステム
  enable_syakkinn_yakusoku_tegata: boolean().notNull().default(false), /// 借金・約束手形
  yakusoku_tegata: integer().notNull().default(20000), /// 約束手形の金額
  enable_marry: boolean().notNull().default(false), /// 結婚・子ども
  enable_myhome: boolean().notNull().default(false), /// マイホーム
  enable_kabukenn: boolean().notNull().default(false), /// 株券
  enable_hokenn_syoukenn: boolean().notNull().default(false), /// 保険証券
});
export const gameRelations = relations(games, ({ many }) => ({
  player_list: many(players),
}));

export const players = pgTable('player', {
  player_id: uuid().primaryKey().defaultRandom(),

  game_id: uuid()
    .notNull()
    .references(() => games.game_id, { onDelete: 'cascade' }),

  order: integer().notNull().default(0), /// 並び
  name: varchar({ length: 40 }).notNull().default(''), /// プレイヤーの名前
  color: varchar({ length: 40 }).notNull().default(''), /// 好きな色
  image: varchar({ length: 100 }).notNull().default(''), /// イメージ
  point: integer().notNull().default(0), /// 点数

  yakusoku_tegata: integer().notNull().default(0), /// 約束手形

  is_married: boolean().notNull().default(false), /// 結婚
  children: integer().notNull().default(0), /// 子ども

  myhome: jsonb().$type<{ image: string; value: number }>().default({ image: '', value: 0 }), /// マイホーム

  kabukenn: integer().notNull().default(0), /// 株券
  seimei_hokenn: boolean().notNull().default(false), /// 生命保険
  kasai_hokenn: boolean().notNull().default(false), /// 火災保険
  zidousya_hokenn: boolean().notNull().default(false), /// 自動車保険
});
export const playerRelations = relations(players, ({ one }) => ({
  game: one(games, {
    fields: [players.game_id],
    references: [games.game_id],
  }),
}));

export const migrate = pgTable('migrate', {
  version: varchar({ length: 40 }).notNull(),
});
