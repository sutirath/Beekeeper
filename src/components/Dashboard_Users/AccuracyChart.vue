<template>
  <div>
    <apexchart
      type="pie"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  props: ["Data"],
  watch: {
    Data: function (newVal) {
      this.checkAccucary(newVal);
    },
  },
  data: () => {
    return {
      chartOptions: {
        labels: ["วิเคราะห์ถูกต้อง", "วิเคราะห์ผิด"],
         colors: ['#00E396', '#008FFB']
      },
      series: [],
      accuracy: 0,
      loss: 0,
    };
  },
  methods: {
    checkAccucary(data) {
      data.forEach((element) => {
        if (element.Class == element.UserClass) {
          this.accuracy += 1;
        } else if (element.Class !== element.UserClass) {
          this.loss += 1;
        }
      });
      this.series.push(this.accuracy, this.loss);
    },
    updateSeriesLine() {
      this.$refs.realtimeChart.updateSeries([
        {
          series: [this.accuracy, this.loss],
        },
      ]);
    },
  },
};
</script>

<style>
</style>