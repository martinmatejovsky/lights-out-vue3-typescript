<template>
  <div class="game-view">
    <h1 class="heading-1">Lights out</h1>
    <p>Click on cells in the field to turn them all into the same color.</p>

    <transition name="fade" mode="out-in">
      <div
        v-if="state === gameStates.new"
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
          <div v-if="state === gameStates.won" class="game-view-victory">
            <h2 class="heading-2">Congratulations!</h2>
            <p>You won the game in {{ timeInMinutesAndSeconds }}.</p>
            <VueButton type="button" @click="clearGame">Play again</VueButton>
          </div>
        </transition>
        <LightsOut
          :grid="grid"
          :colors="colors"
          @lightsOutWin="setGameStateWin"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LightsOut from "../components/LightsOut.vue";
import VueButton from "@/components/VueButton.vue";
import VueSelect from "@/components/VueSelect.vue";
import { SelectOptions } from "@/utils/types";
import { gameStates } from "@/utils/constants";
import { Range } from "@/utils/classes";

export default defineComponent({
  name: "LightsOutView",
  computed: {
    timeInMinutesAndSeconds(): string {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = (this.gameTime % 60).toString().padStart(2, "0");

      return `${minutes}:${seconds}`;
    },
    gameStates() {
      return gameStates;
    },
  },
  components: {
    VueSelect,
    VueButton,
    LightsOut,
  },
  data() {
    return {
      grid: null as number | null,
      colors: null as number | null,
      gridOptions: [] as SelectOptions[],
      colorsOptions: [] as SelectOptions[],
      state: gameStates.new,
      timer: null as unknown as number,
      gameTime: 0 as number,
    };
  },
  created() {
    this.generateOptionsProps();
    this.generateColorsOptions();
  },
  watch: {
    state(newValue: gameStates) {
      if (newValue === gameStates.inProgress) {
        this.startTimer();
      } else if (newValue === gameStates.new) {
        this.gameTime = 0;
      } else if (newValue === gameStates.won) {
        clearInterval(this.timer);
      }
    },
  },
  methods: {
    startTimer(): void {
      this.timer = setInterval(() => {
        this.gameTime++;
      }, 1000);
    },
    clearGame(): void {
      this.grid = null;
      this.colors = null;
      this.state = gameStates.new;
    },
    setGameStateWin(): void {
      this.state = gameStates.won;
    },
    generateOptionsProps(): void {
      const gridOptionsRange = new Range(3, 10);
      for (
        let i: number = gridOptionsRange.min;
        i <= gridOptionsRange.max;
        i++
      ) {
        this.gridOptions.push({ value: i, text: i.toString() });
      }
    },
    generateColorsOptions(): void {
      const colorOptionsRange = new Range(2, 4);
      for (
        let i: number = colorOptionsRange.min;
        i <= colorOptionsRange.max;
        i++
      ) {
        this.colorsOptions.push({ value: i, text: i.toString() });
      }
    },
    updateGrid(value: number): void {
      this.grid = Number(value);
    },
    updateColors(value: number): void {
      this.colors = Number(value);
    },
    startGame(): void {
      this.state = gameStates.inProgress;
    },
  },
});
</script>
