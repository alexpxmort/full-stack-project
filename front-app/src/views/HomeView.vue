<template>
  <div class="home">
    <div class="content-wrapper">
      <div class="charts" v-if="shouldShowChart">
        <div style="width: 700px">
          <BarChart v-bind="barChartPropsMRR" />
        </div>
        <div style="width: 400px; margin-left: 3rem">
          <BarChart v-bind="barChartPropsChurnRate" />
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
        <CustomLoader :isLoading="loading" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import ImageUpload from "@/components/ImageUpload.vue";
import CustomLoader from "@/components/CustomLoader.vue";

import StyledButton from "@/components/StyledButon.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import { BarChart, useBarChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { BASE_URL_API } from "../helper";
Chart.register(...registerables);

export default defineComponent({
  name: "HomeView",
  components: {
    BarChart,
    CustomLoader,
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
    const loading = ref(false);
    const showErrorMsg = ref(false);
    const erroMsg = ref("");

    const dataValuesMRR = ref([]);
    const dataLabelsMRR = ref([]);

    const dataValuesChurnRate = ref([]);
    const dataLabelsChurnRate = ref([]);

    const shouldShowChart = computed(() => dataValuesMRR.value.length > 0);

    const dataMonthlyRateRevenue = computed<ChartData<"bar">>(() => ({
      labels: dataLabelsMRR.value,
      datasets: [
        {
          data: dataValuesMRR.value,
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

    const dataChurnRate = computed<ChartData<"bar">>(() => ({
      labels: dataLabelsChurnRate.value,
      datasets: [
        {
          data: dataValuesChurnRate.value,
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

    const optionsMRR = computed<ChartOptions<"bar">>(() => ({
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

    const optionsChurnRate = computed<ChartOptions<"bar">>(() => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Grafico de Métrica de Churn Rate",
        },
      },
    }));

    const { barChartProps: barChartPropsMRR, barChartRef: barChartRefMRR } =
      useBarChart({
        chartData: dataMonthlyRateRevenue as any,
        options: optionsMRR,
      });

    const {
      barChartProps: barChartPropsChurnRate,
      barChartRef: barChartRefChurnRate,
    } = useBarChart({
      chartData: dataChurnRate as any,
      options: optionsChurnRate,
    });

    async function fetchData() {
      const formData = new FormData();
      formData.append(`file`, file.value as any);
      return await fetch(`${BASE_URL_API}doc/upload-doc`, {
        method: "POST",
        body: formData,
      });
    }

    const handleFileUploaded = (uploadedFile: File) => {
      file.value = uploadedFile;
      showWarn.value = !file.value;
    };

    const handleButtonClick = async () => {
      console.log("handleButtonClick is called!");

      if (file?.value) {
        showWarn.value = false;
        loading.value = true;

        const result = await fetchData();
        const json = await result.json();

        setTimeout(() => {
          loading.value = false;
        }, 800);

        if (!result.ok) {
          showErrorMsg.value = true;
          erroMsg.value = json?.message;
          return;
        }
        showErrorMsg.value = false;
        erroMsg.value = "";
        dataLabelsMRR.value = Object.keys(json.monthRateRevenue) as never[];
        dataValuesMRR.value = Object.values(json.monthRateRevenue) as never[];

        dataLabelsChurnRate.value = Object.keys(json.churnRate) as never[];
        dataValuesChurnRate.value = Object.values(json.churnRate) as never[];
      } else {
        showWarn.value = true;
      }
    };

    return {
      file,
      showWarn,
      handleFileUploaded,
      handleButtonClick,
      dataMonthlyRateRevenue,
      showErrorMsg,
      erroMsg,
      loading,
      optionsChurnRate,
      optionsMRR,
      shouldShowChart,
      barChartPropsMRR,
      barChartRefMRR,
      barChartPropsChurnRate,
      barChartRefChurnRate,
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
  display: flex;
}
</style>
