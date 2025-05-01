<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartRef = ref(null);
    let chartInstance = null;

    const initChart = () => {
      if (chartRef.value) {
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        chartInstance = new Chart(chartRef.value, {
          type: 'line',
          data: props.chartData,
          options: props.chartOptions
        });
      }
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });

    watch(
      () => [props.chartData, props.chartOptions],
      () => {
        initChart();
      },
      { deep: true }
    );

    return { chartRef };
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>