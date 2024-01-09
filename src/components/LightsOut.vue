<template>
  <div :class="['c-lights-out', 'is-greyscale-' + colors]">
    <div class="lights-out-grid">
      <div
        class="lights-out-row"
        v-for="(gridRow, gridIndex) in gameGrid"
        :key="`row${gridIndex}`"
      >
        <div
          v-for="(gridCell, cellIndex) in gridRow"
          :key="`cell${cellIndex}`"
          :class="['lights-out-cell', 'is-cell-color-' + gridCell]"
          @click="cellClick({ row: gridIndex, column: cellIndex })"
        >
          <div class="lights-out-cell-mark">{{ gridCell }}</div>
        </div>
      </div>
    </div>
    <div class="lights-out-controls">
      <VueButton
        type="button"
        @click="returnLastStep"
        :disabled="historyIsEmpty"
        >Step back</VueButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import VueButton from "@/components/VueButton.vue";
import { Range } from "@/utils/classes";
import { CellCoordinates, SwitchDirection } from "@/utils/types";

export default defineComponent({
  name: "LightsOut",
  components: {
    VueButton,
  },
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
    const clickingHistory = ref<CellCoordinates[]>([]);
    let historyIsEmpty = ref(true);

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
        const randomColumn = Math.floor(
          Math.random() * gameGrid.value[randomRow].length
        );

        toggleCell({ row: randomRow, column: randomColumn }, "forward");
      }
    };

    const toggleCell = (
      { row, column }: CellCoordinates,
      direction: SwitchDirection
    ): void => {
      const neighborsCross = [
        [row - 1, column],
        [row + 1, column],
        [row, column - 1],
        [row, column + 1],
        [row, column],
      ];

      for (const [neighborRow, neighborColumn] of neighborsCross) {
        if (
          neighborRow >= 0 &&
          neighborRow < gameGrid.value.length &&
          neighborColumn >= 0 &&
          neighborColumn < gameGrid.value[neighborRow].length
        ) {
          toggleCellColor(
            { row: neighborRow, column: neighborColumn } as CellCoordinates,
            direction as SwitchDirection
          );
        }
      }

      historyIsEmpty.value = clickingHistory.value.length === 0;
    };
    const toggleCellColor = (
      { row, column }: CellCoordinates,
      direction: SwitchDirection
    ): void => {
      if (direction === "forward") {
        if (gameGrid.value[row][column] === props.colors) {
          gameGrid.value[row][column] = 1;
        } else {
          gameGrid.value[row][column] += 1;
        }
      } else if (direction === "backward") {
        if (gameGrid.value[row][column] === 1) {
          gameGrid.value[row][column] = props.colors;
        } else {
          gameGrid.value[row][column] -= 1;
        }
      }
    };
    const returnLastStep = (): void => {
      const lastClick = clickingHistory.value.pop();
      if (lastClick) {
        toggleCell(lastClick, "backward");
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
    const cellClick = (coordinates: CellCoordinates): void => {
      clickingHistory.value.push(coordinates);
      toggleCell(coordinates, "forward");
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

    return {
      gameGrid,
      colorRange,
      clickingHistory,
      historyIsEmpty,
      cellClick,
      returnLastStep,
    };
  },
});
</script>
