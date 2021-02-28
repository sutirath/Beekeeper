<template>
  <div>
    <v-card>
      <v-card-title>
        จุดที่ตั้งทั้งหมด
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="Locations"
        :search="search"
        :sort-by="['date']"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["Locations"],
  data() {
    return {
      search: "",
      headers: [
        {
          text: "ชื่อ",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "วันเดือนปี", value: "date" },
        {
          text: "ที่อยู่",
          value: "Address",
        },
        {
          text: "ตำบล",
          value: "district",
        },
        {
          text: "อำเภอ",
          value: "amphoe",
        },
        {
          text: "จังหวัด",
          value: "province",
        },
        {
          text: "รหัสไปรษณี",
          value: "zipcode",
        },
        {
          text: "อาหาร",
          value: "food",
        },
        {
          text: "สถานะ",
          value: "status",
        },
      ],
    };
  },
};
</script>

<style>
</style>