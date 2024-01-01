<template>
  <div class="c-vue-button">
    <button
      :class="['vue-button-button', componentClasses]"
      :disabled="disabled"
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
    componentClasses(): string {
      return "is-" + this.type;
    },
  },
});
</script>
