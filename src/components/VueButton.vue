<template>
  <div :class="['c-vue-button', componentClasses]">
    <button
      class="vue-button-button"
      :type="type"
      :disabled="disabled"
      @click="$emit('buttonClick')"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VueButton",
  props: {
    type: {
      required: false,
      type: String,
      default: "button",
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    componentClasses(): Record<string, boolean> {
      return {
        ["is-type-" + this.type]: true,
        "is-disabled": this.disabled,
      };
    },
  },
});
</script>
