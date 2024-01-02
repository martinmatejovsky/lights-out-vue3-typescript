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
import { defineComponent, ref, onMounted } from "vue";
import { Range } from "@/utils/classes";

export default defineComponent({
  name: "LightsOut",
  props: {
    grid: {
      required: true,
      type: Number,
    },
    colors: {
      required: true,
      type: Number,
    },
  },
  setup(props, context) {
    const gameGrid = ref<number[][]>([]);
    const colorRange = ref(new Range(1, props.colors));

    /**
     * @name createGridObject
     * @description Creates a grid object. Initially all cells are set to 1.
     * This serves as a solution to the fact that not all random color setups are solvable.
     * After setting up the grid to solved constellation, the grid can be shuffled.
     */
    const createGridObject = (): void => {
      gameGrid.value = [];

      for (let i = 0; i < props.grid; i++) {
        const row = [];

        for (let j = 0; j < props.grid; j++) {
          row[j] = 1;
        }

        gameGrid.value.push(row);
      }
    };
    /**
     * @name shuffleGrid
     * @description Used to shuffle the grid. Must be done by simulating clicks on random cells so that
     * the puzzle has guaranteed a solution.
     *
     */
    const shuffleGrid = (): void => {
      // The larger the grid, the more random clicks are used to shuffle the grid.
      const amountOfRandomClicks =
        gameGrid.value.length * gameGrid.value.length;
      for (let i = 0; i < amountOfRandomClicks; i++) {
        const randomRow = Math.floor(Math.random() * gameGrid.value.length);
        const randomCell = Math.floor(
          Math.random() * gameGrid.value[randomRow].length
        );

        toggleCell(randomRow, randomCell);
      }
    };

    const toggleCell = (row: number, cell: number): void => {
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
          neighborRow < gameGrid.value.length &&
          neighborCell >= 0 &&
          neighborCell < gameGrid.value[neighborRow].length
        ) {
          if (gameGrid.value[neighborRow][neighborCell] === props.colors) {
            gameGrid.value[neighborRow][neighborCell] = 1;
          } else {
            gameGrid.value[neighborRow][neighborCell] += 1;
          }
        }
      }
    };

    const evaluateWinCondition = (): boolean => {
      let firstCellValue = gameGrid.value[0][0];

      for (const gridRow of gameGrid.value) {
        for (const gridCell of gridRow) {
          if (gridCell !== firstCellValue) {
            return false;
          }
        }
      }

      return true;
    };
    const cellClick = (row: number, cell: number): void => {
      toggleCell(row, cell);
      if (evaluateWinCondition()) {
        emitWin();
      }
    };
    const emitWin = (): void => {
      context.emit("lightsOutWin");
    };

    onMounted(() => {
      createGridObject();
      shuffleGrid();
      // prevent generating a grid that is already won
      while (evaluateWinCondition()) {
        shuffleGrid();
      }
    });

    return { gameGrid, colorRange, cellClick };
  },
});
</script>
