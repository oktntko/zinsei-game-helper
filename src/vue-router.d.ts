/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/game/': RouteRecordInfo<'/game/', '/game', Record<never, never>, Record<never, never>>,
    '/game/[game_id]': RouteRecordInfo<'/game/[game_id]', '/game/:game_id', { game_id: ParamValue<true> }, { game_id: ParamValue<false> }>,
    '/game/[game_id]/': RouteRecordInfo<'/game/[game_id]/', '/game/:game_id', { game_id: ParamValue<true> }, { game_id: ParamValue<false> }>,
    '/game/[game_id]/setting': RouteRecordInfo<'/game/[game_id]/setting', '/game/:game_id/setting', { game_id: ParamValue<true> }, { game_id: ParamValue<false> }>,
    '/game/[game_id]/setting/': RouteRecordInfo<'/game/[game_id]/setting/', '/game/:game_id/setting', { game_id: ParamValue<true> }, { game_id: ParamValue<false> }>,
    '/game/[game_id]/setting/player': RouteRecordInfo<'/game/[game_id]/setting/player', '/game/:game_id/setting/player', { game_id: ParamValue<true> }, { game_id: ParamValue<false> }>,
    '/spinwheel': RouteRecordInfo<'/spinwheel', '/spinwheel', Record<never, never>, Record<never, never>>,
  }
}
