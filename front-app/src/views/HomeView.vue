<template>
  <div class="home">
    <div class="content-wrapper">
      <div class="charts" v-if="shouldShowChart">
        <div style="width: 700px">
          <BarChart v-bind="barChartProps" />
        </div>
      </div>

      <ImageUpload @fileUploaded="handleFileUploaded" />
      <div v-if="file" class="file-name">{{ file?.name }}</div>
      <CustomAlert v-if="showErrorMsg" :message="erroMsg" type="error" />

      <CustomAlert
        v-if="showWarn"
        message="É obrigatório selecionar ao menos um arquivo!"
        type="warn"
      />

      <div style="margin-top: 2rem">
        <StyledButton
          :buttonText="buttonText"
          :onClick="handleButtonClick"
          :buttonType="buttonType"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import ImageUpload from "@/components/ImageUpload.vue";
import StyledButton from "@/components/StyledButon.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import { BarChart, useBarChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
  name: "HomeView",
  components: {
    BarChart,
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
    const file: Ref<File | null> = ref(null);

    const showWarn = ref(false);
    const showErrorMsg = ref(false);
    const erroMsg = ref("");

    const dataValues = ref([]);
    const dataLabels = ref([]);
    const toggleLegend = ref(true);

    const shouldShowChart = computed(() => dataValues.value.length > 0);

    const testData = computed<ChartData<"bar">>(() => ({
      labels: dataLabels.value,
      datasets: [
        {
          data: dataValues.value,
          backgroundColor: [
            "#77CEFF",
            "#0079AF",
            "#123E6B",
            "#97B0C4",
            "#A5C8ED",
          ],
        },
      ],
    }));

    const options = computed<ChartOptions<"bar">>(() => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Grafico de Métrica de MRR",
        },
      },
    }));

    const { barChartProps, barChartRef } = useBarChart({
      chartData: testData as any,
      options,
    });

    function switchLegend() {
      toggleLegend.value = !toggleLegend.value;
    }

    async function fetchData() {
      const formData = new FormData();
      formData.append(`file`, file.value as any);
      return await fetch(`http://localhost:3000/csv/upload-csv`, {
        method: "POST",
        body: formData,
      });
    }

    const handleFileUploaded = (uploadedFile: File) => {
      file.value = uploadedFile;
      showWarn.value = !file.value;
    };

    const handleButtonClick = async () => {
      console.log(file);
      if (file?.value) {
        showWarn.value = false;

        console.log("Button clicked!");
        const result = await fetchData();
        const json = await result.json();

        if (!result.ok) {
          showErrorMsg.value = true;
          erroMsg.value = json?.message;
          return;
        }
        showErrorMsg.value = false;
        erroMsg.value = "";
        dataLabels.value = Object.keys(json) as never[];
        dataValues.value = Object.values(json) as never[];
      } else {
        showWarn.value = true;
      }
    };

    return {
      file,
      showWarn,
      handleFileUploaded,
      handleButtonClick,
      switchLegend,
      testData,
      showErrorMsg,
      erroMsg,
      options,
      shouldShowChart,
      barChartRef,
      barChartProps,
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
.charts {
  margin-top: 2rem;
}
</style>
