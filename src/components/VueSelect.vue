<template>
  <div class="c-vue-select">
    <label :for="`vue-select-${name}`"></label>
    <select :name="`vue-select-${name}`">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
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
      type: [] as PropType<SelectOptions[]>,
    },
  },
  data: function () {
    return {
      selectedValue: null as string | null,
    };
  },
  computed: {
    selectId(): string {
      return `vue-select-${this.name}`;
    },
  },
  watch: {
    selectedValue: function (newValue) {
      this.$emit("select", newValue);
    },
  },
  mounted: function () {
    const select = document.querySelector(
      `select[name="${this.selectId}"]`
    ) as HTMLSelectElement;
    select.addEventListener("change", () => {
      this.selectedValue = select.value;
    });
  },
});
</script>
