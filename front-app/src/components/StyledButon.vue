<template>
  <button class="custom-button" @click="handleClick">
    {{ buttonText }}
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "StyledButton",
  props: {
    buttonText: {
      type: String,
      default: "Click me",
    },
    onClick: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  },
  methods: {
    handleClick() {
      this.onClick();
    },
  },
});
</script>

<style scoped lang="scss">
.custom-button {
  padding: 10px 20px;
  margin-top: 5rem;
  font-size: 16px;
  cursor: pointer;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #368567;
  }
}
</style>
