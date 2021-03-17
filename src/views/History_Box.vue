<template>
  <div>
    <appbar />
    <center><h1>ประวัติการบันทึก</h1></center>
    <br />
    <div class="container"><HistoryTable class="hpad" v-bind:History="History" /></div>
    <Myfooter />
  </div>
</template>

<script>
import appbar from "../components/appbar";
import { db } from "@/main";
import HistoryTable from "../components/History/HistoryTable";
import Myfooter from "@/components/Myfooter";
export default {
  data() {
    return {
      id: this.$route.params.Detail,
      History: [],
    };
  },
  components: {
    appbar,
    HistoryTable,
    Myfooter,
  },
  created() {
    this.getAllHistory();
  },
  methods: {
    getAllHistory() {
      db.collection("History")
        .where("BoxId", "==", this.id)
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
.hpad{
  padding-bottom: 200px;
}
</style>
