<template>
  <div>
    <apexchart type="pie" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
export default {
  props: ["Data"],
  watch: {
    Data: function (newVal) {
      this.createChart(newVal);
    },
  },
  data() {
    return {
      label: [],
      b_class: [],
      chartOptions: {
        labels: [],
      },
      series: [],
    };
  },
  methods: {
    createChart(data) {
      var bee_class = [];
      data.forEach((element) => {
        if (element.Class == element.UserClass) {
          bee_class.push(element.Class);
        }
      });
      var current = null;
      var cnt = 0;
      bee_class.sort();
      for (var i = 0; i < bee_class.length; i++) {
        if (bee_class[i] != current) {
          if (cnt > 0) {
            this.label.push(cnt);
            this.b_class.push(current);
          }
          current = bee_class[i];
          cnt = 1;
        } else {
          cnt++;
        }
      }
      if (cnt > 0) {
        this.label.push(cnt);
        this.b_class.push(current);
        this.chartOptions = {
          labels: this.b_class,
          theme: {
            palette: "palette1",
          },
        };
        this.series = this.label;
      }
    },
  },
};
</script>

<style>
</style>