<template>
  <div class="game-view">
    <div class="game-view-header">
      <h1 class="heading-1">Lights out</h1>
      <p>Click on cells in the field to turn them all into the same color.</p>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="state === gameStatesEnum.new"
        key="settings"
        class="game-view-settings"
      >
        <h2 class="heading-2">Select game parameters</h2>
        <VueSelect name="grid" :options="gridOptions" @select="updateGrid"
          >Size of a field</VueSelect
        >
        <VueSelect name="colors" :options="colorsOptions" @select="updateColors"
          >How many colors</VueSelect
        >
        <VueButton
          type="submit"
          :disabled="!colors || !grid"
          @buttonClick="startGame"
          >Start game</VueButton
        >
      </div>

      <div v-else key="game" class="game-view-game-container">
        <transition name="fade">
          <div v-if="state === gameStatesEnum.won" class="game-view-victory">
            <h2 class="heading-2">Congratulations!</h2>
            <p>You won the game in time {{ timeInMinutesAndSeconds }}.</p>
            <VueButton type="button" @click="clearGame">Play again</VueButton>
          </div>
        </transition>
        <LightsOut
          :grid="grid"
          :colors="colors"
          @gameStateChanged="setGameState"
        />
        <div class="game-view-controls"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import LightsOut from "../components/LightsOut.vue";
import VueButton from "@/components/VueButton.vue";
import VueSelect from "@/components/VueSelect.vue";
import { GameState, SelectOptions } from "@/utils/types";
import { GameStates } from "@/utils/constants";
import { Range } from "@/utils/classes";

export default defineComponent({
  name: "LightsOutView",
  components: {
    VueSelect,
    VueButton,
    LightsOut,
  },
  setup() {
    const grid = ref<number | null>(null);
    const colors = ref<number | null>(null);
    const gridOptions = ref<SelectOptions[]>([]);
    const colorsOptions = ref<SelectOptions[]>([]);
    const state = ref<GameStates>(GameStates.new);
    const gameStatesEnum = GameStates;
    const timer = ref<number | undefined>(undefined);
    const gameTime = ref<number>(0);

    // methods
    const generateOptionsProps = (): void => {
      const gridOptionsRange = new Range(3, 10);
      for (
        let i: number = gridOptionsRange.min;
        i <= gridOptionsRange.max;
        i++
      ) {
        gridOptions.value.push({ value: i, text: i.toString() });
      }
    };
    const generateColorsOptions = (): void => {
      const colorsOptionsRange = new Range(2, 5);
      for (
        let i: number = colorsOptionsRange.min;
        i <= colorsOptionsRange.max;
        i++
      ) {
        colorsOptions.value.push({ value: i, text: i.toString() });
      }
    };
    const startGame = (): void => {
      state.value = GameStates.inProgress;
    };
    const clearGame = (): void => {
      grid.value = null;
      colors.value = null;
      state.value = GameStates.new;
    };
    const updateGrid = (value: number): void => {
      grid.value = Number(value);
    };
    const updateColors = (value: number): void => {
      colors.value = Number(value);
    };
    const setGameState = (newState: GameState): void => {
      state.value = GameStates[newState];
      if (newState === GameStates.new) {
        clearGame();
      }
    };
    const startTimer = (): void => {
      timer.value = setInterval(() => {
        gameTime.value++;
      }, 1000);
    };

    // watch
    watch(state, (newValue) => {
      if (newValue === GameStates.inProgress) {
        startTimer();
      } else {
        clearInterval(timer.value);
      }
    });

    // computed
    const timeInMinutesAndSeconds = computed((): string => {
      const minutes = Math.floor(gameTime.value / 60);
      const seconds = (gameTime.value % 60).toString().padStart(2, "0");

      return `${minutes}:${seconds}`;
    });

    onBeforeMount(() => {
      generateOptionsProps();
      generateColorsOptions();
    });

    return {
      grid,
      colors,
      gridOptions,
      colorsOptions,
      state,
      gameStatesEnum,
      gameTime,
      startGame,
      clearGame,
      updateGrid,
      updateColors,
      setGameState,
      timeInMinutesAndSeconds,
    };
  },
  watch: {},
  methods: {},
});
</script>
