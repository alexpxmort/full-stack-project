<template>
  <div class="home">
    <div class="content-wrapper">
      <ImageUpload @fileUploaded="handleFileUploaded" />
      <div v-if="fileName" class="file-name">{{ fileName }}</div>
      <CustomAlert
        v-if="showWarn"
        message="É obrigatório selecionar ao menos uma imagem!"
        type="warn"
      />

      <StyledButton
        :buttonText="buttonText"
        :onClick="handleButtonClick"
        :buttonType="buttonType"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ImageUpload from "@/components/ImageUpload.vue";
import StyledButton from "@/components/StyledButon.vue";
import CustomAlert from "@/components/CustomAlert.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    ImageUpload,
    StyledButton,
    CustomAlert,
  },
  data() {
    return {
      buttonText: "Enviar",
    };
  },
  setup() {
    const fileName = ref("");
    const showWarn = ref(false);

    const handleFileUploaded = (name: string) => {
      fileName.value = name;
      showWarn.value = !fileName.value;
    };

    const handleButtonClick = () => {
      if (fileName?.value) {
        console.log("Button clicked!");
        showWarn.value = false;
      } else {
        showWarn.value = true;
      }
    };

    return {
      fileName,
      showWarn,
      handleFileUploaded,
      handleButtonClick,
    };
  },
});
</script>

<style scoped lang="scss">
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Defina a altura desejada ou utilize flex-grow para preencher a altura */
}

.content-wrapper {
  text-align: center; /* Opcional, centraliza o conteúdo horizontalmente */
}

.file-name {
  margin-top: 10px;
  color: #333;
}
</style>
