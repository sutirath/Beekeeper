<template>
  <div>
    <apexchart
      el="app1"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  props: ["Data"],
  data: () => {
    return {
      chartOptions: {
        chart: {
          id: "vuechart",
        },
        xaxis: {
          categories: [],
        },
         plotOptions: {
          bar: {
            distributed: true
          }
        },
      },
      series: [
        {
          name: "กล่องผึ้ง",
          data: [],
        },
      ],
      Beebox: [],
      visData: [],
      visOption: [],
    };
  },
  watch: {
    Data: function (Val) {
      this.Beebox = Val;
      this.visualizData(Val);
    },
  },

  created() {},

  methods: {
    visualizData(data) {
      var result = [];
      data.forEach((doc) => {
        result.push(doc.LocationName.substring(0, 6));
      });
      var current = null;
      var cnt = 0;
      result.sort();
      for (var i = 0; i < result.length; i++) {
        if (result[i] != current) {
          if (cnt > 0) {
            this.visData.push(cnt);
            this.visOption.push(current);
          }
          current = result[i];
          cnt = 1;
        } else {
          cnt++;
        }
      }
      if (cnt > 0) {
        this.visData.push(cnt);
        this.visOption.push(current);
        this.series = [
          {
            data: this.visData,
          },
        ];
        this.chartOptions = {
          xaxis: {
            categories: this.visOption,
          },
          theme: {
          palette: "palette1",
        },
        };
      }
    },
  },
};
</script>

<style>
</style>