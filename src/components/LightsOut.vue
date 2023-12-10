<template>
  <div class="c-lights-out">
    <div class="lights-out-grid">
      <div class="lights-out-row" v-for="gridRow in grid" :key="gridRow">
        <div
          class="lights-out-cell"
          v-for="gridCell in grid"
          :key="gridCell"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Range } from "@/utils/classes";

export default defineComponent({
  name: "LightsOut",
  props: {
    grid: {
      required: false,
      type: Number,
      default: 4, // TODO- no defaults
    },
    colors: {
      required: false,
      type: Number,
      default: 3, // TODO- no defaults
    },
  },
  data: function () {
    return {
      gameGrid: [] as number[][],
      colorRange: new Range(1, this.colors),
    };
  },
  mounted() {
    this.createGridObject();
  },
  methods: {
    createGridObject(): void {
      for (let i = 0; i < this.grid; i++) {
        this.gameGrid[i] = [];

        for (let j = 0; j < this.grid; j++) {
          this.gameGrid[i][j] = this.colorRange.generateRandom();
        }
      }
    },
  },
});
</script>
