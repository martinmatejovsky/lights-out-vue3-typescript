<template>
  <div class="home">
    <h1>Game in typescript</h1>
    <button @click="openLightsOut">Game Lights Out</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
  methods: {
    openLightsOut() {
      this.$router.push("lightsOut");
    },
  },
});
</script>
