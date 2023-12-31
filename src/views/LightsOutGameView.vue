<template>
  <div class="game-view">
    <h1>Lights out</h1>
    <h2>Select game parameters</h2>

    <div class="game-view-settings">
      <VueSelect name="grid" :options="gridOptions" @select="updateGrid"
        >Size of a field</VueSelect
      >
      <VueSelect name="colors" :options="colorsOptions" @select="updateColors"
        >Number of colors</VueSelect
      >
      <VueButton type="submit" :disabled="!colors || !grid" @click="startGame"
        >Start game</VueButton
      >
    </div>
    <div class="game-view-game-container">
      <LightsOut @lightsOutWin="setGameStateWin" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LightsOut from "../components/LightsOut.vue";
import VueButton from "@/components/VueButton.vue";
import VueSelect from "@/components/VueSelect.vue";
import { SelectOptions } from "@/utils/interfaces";
import { gameStates } from "@/utils/constants";
import { Range } from "@/utils/classes";

export default defineComponent({
  name: "LightsOutView",
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
    };
  },
  created() {
    this.generateOptionsProps();
    this.generateColorsOptions();
  },
  methods: {
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
