<template>
  <div class="loader-container" v-if="isLoading">
    <div class="loader"></div>
    <div style="margin-left: 1rem">Carregando dados ...</div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomLoader",
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #4caf50; /* Cor verde mais intensa */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
