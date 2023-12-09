<template>
  <div class="c-vue-select">
    <label :for="`vue-select-${name}`" class="vue-select-label">
      <slot>Choose an option</slot>
    </label>
    <select
      :id="`vue-select-${name}`"
      :name="`vue-select-${name}`"
      class="vue-select-select"
    >
      <option
        v-for="option in optionsSet"
        :key="option.value"
        :value="option.value"
        :disabled="emptyStartingOption && option.value === ''"
        :selected="emptyStartingOption && option.value === ''"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { SelectOptions } from "@/utils/interfaces";

// ========= export
export default defineComponent({
  name: "VueSelect",
  props: {
    name: {
      required: true,
      type: String,
    },
    options: {
      required: true,
      type: Array as PropType<SelectOptions[]>,
    },
    emptyStartingOption: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  data: function () {
    return {
      selectedValue: null as SelectOptions["value"],
      optionsSet: [] as SelectOptions[],
    };
  },
  computed: {
    selectId(): string {
      return `vue-select-${this.name}`;
    },
  },
  watch: {
    selectedValue: function (newValue) {
      if (newValue) {
        this.$emit("select", newValue);
      }
    },
  },
  created() {
    this.populateOptions();
    this.selectedValue = this.optionsSet[0].value;
  },
  mounted: function () {
    const select = document.querySelector(
      `select[name="${this.selectId}"]`
    ) as HTMLSelectElement;
    select.addEventListener("change", () => {
      this.selectedValue = select.value;
    });
  },
  methods: {
    populateOptions(): void {
      if (this.emptyStartingOption) {
        this.optionsSet.push({ value: "", text: "Choose" });
      }
      this.options.forEach((option) => {
        this.optionsSet.push(option);
      });
    },
  },
});
</script>
