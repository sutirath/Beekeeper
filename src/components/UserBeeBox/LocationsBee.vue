<template>
  <v-card>
    <v-card-title>
      จุดที่ตั้งกล่องผึ้ง
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
      :items="Data"
      :search="search"
      :sort-by="['Name']"
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  props: ["Data"],
  data() {
    return {
      headers: [
        {
          text: "ชื่อ",
          align: "start",
          value: "Name",
        },
        { text: "อัพเดตล่าสุด", value: "Created" },
        {
          text: "จุดที่ตั้ง",
          value: "LocationName",
        },
      ],
      search: "",
    };
  },
};
</script>

<style>
</style>