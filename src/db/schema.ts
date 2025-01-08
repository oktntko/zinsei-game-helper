import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';

export const games = pgTable('game', {
  game_id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 20 }).notNull(), /// ゲームの名前
  description: varchar({ length: 100 }).notNull().default(''), /// ゲームの説明
  players: integer().notNull(), /// プレイヤーの数
  initial_money: integer().notNull(), /// 最初の所持金
  roll: integer().notNull(), /// 出目
});
export const gameRelations = relations(games, ({ many }) => ({
  player_list: many(players),
  item_list: many(items),
  job_list: many(jobs),
}));

export const players = pgTable('player', {
  player_id: uuid().primaryKey().defaultRandom(),

  game_id: uuid()
    .notNull()
    .references(() => games.game_id),
  job_id: uuid().references(() => jobs.job_id),

  name: varchar({ length: 20 }).notNull(), /// プレイヤーの名前
  color: varchar({ length: 10 }).notNull(), /// 好きな色
  image: varchar({ length: 100 }).notNull(), /// イメージ
  money: integer().notNull(), /// 所持金
});
export const playerRelations = relations(players, ({ one, many }) => ({
  game: one(games, {
    fields: [players.game_id],
    references: [games.game_id],
  }),
  job: one(jobs, {
    fields: [players.job_id],
    references: [jobs.job_id],
  }),
  item_list: many(_PlayerToItem),
}));

export const items = pgTable('item', {
  item_id: uuid().primaryKey().defaultRandom(),

  game_id: uuid()
    .notNull()
    .references(() => games.game_id),

  name: varchar({ length: 20 }).notNull(), /// アイテムの名前
  description: varchar({ length: 100 }).notNull().default(''), /// 説明
  value: integer().notNull(), /// 価値
});
export const itemRelations = relations(items, ({ one, many }) => ({
  game: one(games, {
    fields: [items.game_id],
    references: [games.game_id],
  }),
  player_list: many(_PlayerToItem),
}));

export const jobs = pgTable('job', {
  job_id: uuid().primaryKey().defaultRandom(),

  game_id: uuid()
    .notNull()
    .references(() => games.game_id),

  name: varchar({ length: 20 }).notNull(), /// 職業の名前
  description: varchar({ length: 100 }).notNull().default(''), /// 説明
  salary: integer().notNull(), /// 給料
});
export const jobRelations = relations(jobs, ({ one, many }) => ({
  game: one(games, {
    fields: [jobs.game_id],
    references: [games.game_id],
  }),
  player_list: many(players),
}));

export const _PlayerToItem = pgTable(
  '_PlayerToItem',
  {
    player_id: uuid()
      .notNull()
      .references(() => players.player_id),
    item_id: uuid()
      .notNull()
      .references(() => items.item_id),
  },
  (t) => [primaryKey({ columns: [t.player_id, t.item_id] })],
);
export const _PlayerToItemRelations = relations(_PlayerToItem, ({ one }) => ({
  player: one(players, {
    fields: [_PlayerToItem.player_id],
    references: [players.player_id],
  }),
  item: one(items, {
    fields: [_PlayerToItem.item_id],
    references: [items.item_id],
  }),
}));
