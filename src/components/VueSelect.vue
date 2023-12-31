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
import { defineComponent, PropType, ref, computed, onMounted } from "vue";
import { SelectOptions } from "@/utils/types";

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
  setup(props) {
    const selectedValue = ref<SelectOptions["value"]>(null);
    const optionsSet = ref<SelectOptions[]>([]);

    const populateOptions = (): void => {
      if (props.emptyStartingOption) {
        optionsSet.value.push({ value: "", text: "Choose" });
      }
      props.options.forEach((option) => {
        optionsSet.value.push(option);
      });
    };

    const selectId = computed(() => {
      return `vue-select-${props.name}`;
    });

    const initializeSelect = (): void => {
      selectedValue.value = optionsSet.value[0].value;
      const select = document.querySelector(
        `select[name="${selectId.value}"]`
      ) as HTMLSelectElement;
      select.addEventListener("change", () => {
        selectedValue.value = select.value;
      });
    };

    onMounted(() => {
      populateOptions();
      initializeSelect();
    });
    return { selectedValue, optionsSet, populateOptions };
  },
  watch: {
    selectedValue: function (newValue) {
      if (newValue) {
        this.$emit("select", newValue);
      }
    },
  },
});
</script>
