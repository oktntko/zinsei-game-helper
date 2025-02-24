<script setup lang="ts">
/**
 * ●データストレージ
 *   - セッションストレージ
 *   - データ構成
 *     - プレイヤー
 *       - なまえ
 *       - しょじきん
 *       - もちもの
 *       - 職業
 *       - 変更履歴
 *     - もちもの
 * ●ルーレット
 * ●プレイヤー一覧（順番）
 * ●プレイヤー情報の編集
 *   - しょじきんの増減
 *   - もちものの増減
 *   - もとに戻す・やり直し
 * ●ゲーム設定
 *   - もちものの設定（換算値）
 *   - 保存（プレイヤー・初期値・もちもの）
 *
 * ●ゲーム一覧画面
 *   => ゲームを選ぶ
 *      => 編集画面
 *   => はじめてのゲーム
 * ●ゲーム作成画面
 *   □ ゲームの名前
 *   □ プレイヤーの数を決める
 *   □ プレイヤーを作る（ループ）
 *   □ 所持金を決める
 *   □ ルーレットの数を決める（６、１０、１２）
 *   □ 職業を決める（オプション）
 *   □ アイテムを決める（オプション）
 * ●ゲーム画面
 *   □ ルーレットを回す
 *   □ 編集モードのオン・オフ
 *   □ しょじきんの編集など
 *   □ 職業の変更
 *   □ もちものの変更
 *   □ 決定
 *   □ 元に戻す（編集内容の破棄）
 *   □ 元に戻す（前の状態に戻す）
 *   □ やり直す
 * ●もちものの追加・変更画面
 * ●職業の追加・変更画面
 */
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-200"
        enter-to-class="transform opacity-100"
      >
        <KeepAlive>
          <Suspense>
            <!-- main content -->
            <component :is="Component"></component>

            <!-- loading state -->
            <template #fallback>
              <div class="flex min-h-lvh grow flex-col items-center justify-center gap-4">
                <span
                  class="icon-[line-md--loading-loop] h-16 w-16 text-gray-600 text-opacity-60"
                ></span>
                <span class="animate-pulse">ちょっとまってね</span>
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
