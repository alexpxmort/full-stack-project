<template>
  <div :class="alertClass">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

export default defineComponent({
  name: "CustomAlert",
  props: {
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<"warn" | "error" | "success">,
      default: "warn",
    },
  },
  setup(props) {
    return {
      alertClass: `custom-alert ${props.type}`,
    };
  },
});
</script>

<style scoped lang="scss">
.custom-alert {
  padding: 10px;
  max-width: 300px;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 10px;
  color: #fff;

  &.warn {
    background-color: #ff9800; // Cor amarela para o tipo 'warn'
  }

  &.error {
    background-color: #e57373; // Cor vermelha para o tipo 'error'
  }

  &.success {
    background-color: #81c784; // Cor verde para o tipo 'success'
  }
}
</style>
