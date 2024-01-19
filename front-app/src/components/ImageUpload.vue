<template>
  <div>
    <label class="custom-file-upload">
      <input type="file" @change="handleFileChange" />
      Escolher arquivo
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ImageUpload",
  setup(_, { emit }) {
    // Manipulador de evento para a mudança de arquivo
    const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        emit("fileUploaded", file);
      }
    };

    return {
      handleFileChange,
    };
  },
});
</script>

<style scoped lang="scss">
.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #368567;
  }

  input {
    display: none;
  }
}
</style>
