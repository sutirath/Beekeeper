<template>
  <div>
    <v-card>
    <v-card-title>
      กล่องเลี้ยงผึ้งทั้งหมด
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
      :items="BeeBox"
      :search="search"
      :sort-by="['Name']"
    ></v-data-table>
  </v-card>
  </div>
</template>

<script>
export default {
  props: ["BeeBox"],
  data() {
    return {
      search: "",
      headers: [
          {
            text: 'ชื่อ',
            align: 'start',
            sortable: true,
            value: 'Name',
          },
          { text: 'อัพเดตล่าสุด', value: 'Created'},
          { text: 'ชนิดแมลง', value: 'Species' },
          { text: 'ที่อยู่ล่าสุด', value: 'LocationName' },
        ],
    };
  },

};
</script>

<style>
</style>