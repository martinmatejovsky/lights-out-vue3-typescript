<template>
  <div class="home">
    <h1>Lights out</h1>
    <LightsOut />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LightsOut from "../components/LightsOut.vue";

export default defineComponent({
  name: "LightsOutView",
  components: {
    LightsOut,
  },
});
</script>
