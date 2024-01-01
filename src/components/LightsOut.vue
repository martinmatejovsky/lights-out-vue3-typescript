<template>
  <div :class="['c-lights-out', 'is-greyscale-' + colors]">
    <div class="lights-out-grid">
      <div
        class="lights-out-row"
        v-for="(gridRow, gridIndex) in gameGrid"
        :key="'row' + gridIndex"
      >
        <div
          v-for="(gridCell, cellIndex) in gridRow"
          :key="'cell' + cellIndex"
          :class="['lights-out-cell', 'is-cell-color-' + gridCell]"
          @click="cellClick(gridIndex, cellIndex)"
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
      default: 2, // TODO - no defaults
    },
    colors: {
      required: false,
      type: Number,
      default: 2, // TODO - no defaults
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
    this.shuffleGrid();
    // prevent generating a grid that is already won
    while (this.evaluateWinCondition()) {
      this.shuffleGrid();
    }
  },
  methods: {
    cellClick(row: number, cell: number): void {
      this.toggleCell(row, cell);
      if (this.evaluateWinCondition()) {
        this.emitWin();
      }
    },
    /**
     * @name shuffleGrid
     * @description Used to shuffle the grid. Must be done by simulating clicks on random cells so that
     * the puzzle has guaranteed a solution.
     *
     */
    shuffleGrid(): void {
      // the larger the grid, the more random clicks are used to shuffle the grid
      const amountOfRandomClicks = this.gameGrid.length * this.gameGrid.length;
      for (let i = 0; i < amountOfRandomClicks; i++) {
        const randomRow = Math.floor(Math.random() * this.gameGrid.length);
        const randomCell = Math.floor(
          Math.random() * this.gameGrid[randomRow].length
        );

        this.toggleCell(randomRow, randomCell);
      }
    },
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
          if (this.gameGrid[neighborRow][neighborCell] === this.colors) {
            this.gameGrid[neighborRow][neighborCell] = 1;
          } else {
            this.gameGrid[neighborRow][neighborCell] += 1;
          }
        }
      }
    },
    emitWin(): void {
      this.$emit("lightsOutWin");
    },
    /**
     * @name createGridObject
     * @description Creates a grid object. Initially all cells are set to 1.
     * This serves as a solution to the fact that not all random color setups are solvable.
     * After setting up the grid to solved constellation, the grid can be shuffled.
     */
    createGridObject(): void {
      this.gameGrid = [];

      for (let i = 0; i < this.grid; i++) {
        const row = [];

        for (let j = 0; j < this.grid; j++) {
          row[j] = 1;
        }

        this.gameGrid.push(row);
      }
    },
    evaluateWinCondition(): boolean {
      let firstCellValue = this.gameGrid[0][0];

      for (const gridRow of this.gameGrid) {
        for (const gridCell of gridRow) {
          if (gridCell !== firstCellValue) {
            return false;
          }
        }
      }

      return true;
    },
  },
});
</script>
