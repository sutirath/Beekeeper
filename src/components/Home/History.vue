<template>
  <div>
    <v-card>
      <v-card-title>
       ประวัติการบันทึกผล
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
        :items="Historys"
        :search="search"
        :sort-by="['BoxName', 'date', 'time']"
        multi-sort
      >
        <template v-slot:item.Class="{ item }">
          <v-chip :color="getColor(item.Class)" dark>
            {{ item.Class }}
          </v-chip>
        </template>
        <template v-slot:item.UserClass="{ item }">
          <v-chip :color="getColor(item.UserClass)" dark>
            {{ item.UserClass }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["Historys"],
  data() {
    return {
      search: "",
      headers: [
        {
          text: "วันที่",
          align: "start",
          value: "date",
        },
        { text: "เวลา", value: "time" },
        {
          text: "กล่อง",
          value: "BoxName",
        },
        {
          text: "ผลวิเคราะห์",
          value: "Class",
        },
        {
          text: "ความถูกต้อง",
          value: "Accuracy",
        },
        {
          text: "เลือก",
          value: "UserClass",
        },
      ],
    };
  },
  methods: {
    getColor(Class) {
      if (Class == "ควันไฟ") return "orange";
      else if (Class == "นางพญาหาย") return "red";
      else if (Class == "ปกติ") return "green";
      else if (Class == "ศัตรูรบกวน") return "blue";
      else if (Class == "ขาดเกสร") return "pink";
      else if (Class == "มีไร") return "purple";
    },
      getAllHistory(id) {
      db.collection("History")
        .where("Farm", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            this.History.push(doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
  },
};
</script>

<style>
</style>