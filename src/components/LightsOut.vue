<template>
  <div class="c-lightsOut">
    <p>Select game parameters</p>
    <div class="lights-out-settings">
      <VueSelect name="grid" :options="gridOptions" @select="updateGrid"
        >Size of a field</VueSelect
      >
      <VueSelect name="colors" :options="colorsOptions" @select="updateColors"
        >Number of colors</VueSelect
      >
      <button
        class="lights-out-button-start"
        :disabled="!colors || !grid"
        @click="startGame"
      >
        Start game
      </button>
    </div>
    <p>{{ grid }}</p>
    <p>{{ colors }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueSelect from "@/components/VueSelect.vue";
import { Range } from "@/utils/classes";
import { SelectOptions } from "@/utils/interfaces";
import { gameStates } from "@/utils/constants";

export default defineComponent({
  name: "LightsOut",
  components: { VueSelect },
  props: {},
  data: function () {
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
    startGame(): void {
      this.state = gameStates.inProgress;
    },
    updateGrid(value: string): void {
      this.grid = parseInt(value);
    },
    updateColors(value: string): void {
      this.colors = parseInt(value);
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
  },
});
</script>
