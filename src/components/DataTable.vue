<template>
  <div>
    <div class="container">
      <div class="pddata">
        <v-card>
          <v-card-title>
            ฟาร์ม
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
            :items="Farm"
            :search="search"
          ></v-data-table>
        </v-card>
      </div>

      <div class="pddata">
        <v-card>
          <v-card-title>
            กล่องเลี้ยงผึ้ง
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search_bee"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="header_Bee"
            :items="BeeBox"
            :search="search_bee"
            sort-by="FarmName"
          ></v-data-table>
        </v-card>
      </div>
      <div>
        <v-card>
          <v-card-title>
            ผู้ใช้งาน
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search_bee"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers_User"
            :items="AllUser"
            :search="search_bee"
            sort-by="FarmName"
          ></v-data-table>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      search_bee: "",
      headers_User: [
      {
        text: "ชื่อ",
        align: "start",
        sortable: false,
        value: "displayName",
      },
      {
        text: "อีเมลล์",
        value: "email",
      },
      {
        text: "เลขบัตรประชาชน",
        value: "customClaims.IdCard",
      },
      {
        text: "เบอร์โทรศัพท์",
        value: "phoneNumber",
      },
      {
        text: "สถานะ",
        value: "customClaims.User",
        sortable: false,
      },
      {
        text: "ฟาร์ม",
        value: "customClaims.FarmName",
      },
    ],
      header_Bee: [
        {
          text: "ชื่อฟาร์ม",
          align: "start",
          sortable: true,
          value: "FarmName",
        },
        {
          text: "ชื่อ",
          value: "Name",
        },
        {
          text: "วันที่สร้าง",
          value: "Created",
        },
        {
          text: "พันธ์ผึ้ง",
          value: "Species",
        },
        {
          text: "พันธ์ผึ้ง",
          value: "LocationName",
        },
      ],
      headers: [
        {
          text: "ชื่อ ฟาร์ม",
          align: "start",
          sortable: false,
          value: "Name",
        },
        {
          text: "เจ้าของ",
          value: "FirstName",
        },
        {
          value: "LastName",
        },
        {
          text: "เบอร์โทรศัพท์",
          value: "Tel",
        },
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
          text: "ชนิดแมลง",
          value: "Species",
        },
      ],
    };
  },
  props: ["Farm", "BeeBox","AllUser"],
};
</script>

<style>
.pddata {
  padding-bottom: 50px;
}
</style>
