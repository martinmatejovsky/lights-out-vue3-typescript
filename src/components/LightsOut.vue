<template>
  <div class="c-lights-out">
    <div class="lights-out-grid">
      <div
        class="lights-out-row"
        v-for="(gridRow, gridIndex) in gameGrid"
        :key="'row' + gridRow"
      >
        <div
          v-for="(gridCell, cellIndex) in gridRow"
          :key="'cell' + gridCell"
          :class="['lights-out-cell', 'is-cell-color-' + gridCell]"
          @click="toggleCell(gridIndex, cellIndex)"
        >
          <div class="lights-out-cell-mark">{{ gridCell }}</div>
        </div>
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
      default: 4, // TODO - no defaults
    },
    colors: {
      required: false,
      type: Number,
      default: 3, // TODO - no defaults
    },
  },
  data: function () {
    return {
      gameGrid: [] as number[][],
      colorRange: new Range(1, this.colors),
    };
  },
  created() {
    this.createGridObject();
  },
  methods: {
    toggleCell(row: number, cell: number): void {
      const neighborsCross = [
        [row - 1, cell],
        [row + 1, cell],
        [row, cell - 1],
        [row, cell + 1],
        [row, cell],
      ];

      for (const [neighborRow, neighborCell] of neighborsCross) {
        if (
          neighborRow >= 0 &&
          neighborRow < this.gameGrid.length &&
          neighborCell >= 0 &&
          neighborCell < this.gameGrid[neighborRow].length
        ) {
          this.gameGrid[neighborRow][neighborCell] =
            (this.gameGrid[neighborRow][neighborCell] + 1) % this.colors;
        }
      }
    },
    createGridObject(): void {
      this.gameGrid = [];

      for (let i = 0; i < this.grid; i++) {
        const row = [];

        for (let j = 0; j < this.grid; j++) {
          row[j] = this.colorRange.generateRandom();
        }

        this.gameGrid.push(row);
      }
    },
  },
});
</script>
