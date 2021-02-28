<template>
  <div>
    <appbar />

    <div class="container">
      <center>
        <H1>ระบบจัดการฟาร์ม</H1>
      </center>
      <br />
      <br /><br />
      <div class="pd">
        <FarmTable />
      </div>
    </div>
    <Myfooter />
  </div>
</template>

<script>
import appbar from "@/components/appbar";
import FarmTable from "@/components/FarmTable";
import Myfooter from "@/components/Myfooter";
import { db } from "@/main";
import axios from "axios";
export default {
  data() {
    return {};
  },
  created() {
    db.collection("BeeBox").onSnapshot((snapshot) => {
      var BeeBox = [];
      snapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        BeeBox.push(doc.data());
        this.$store.state.AllBeeBox = BeeBox.length;
      });
    });
  },
  created() {
    this.getAllUser();
    this.getAllBeeBox();
  },
  methods: {
    getAllBeeBox() {
      db.collection("BeeBox").onSnapshot((snapshot) => {
        var BeeBox = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          BeeBox.push(doc.data());
          this.$store.state.AllBeeBox = BeeBox.length;
        });
      });
    },
    getAllUser() {
      var qs = require("qs");
      var data = qs.stringify({});
      var config = {
        method: "get",
        url: "https://3.138.195.177:3000/getAllUser",
        headers: {},
        data: data,
      };
      axios(config)
        .then((response) => {
          this.$store.state.AllUser = JSON.stringify(
            response.data.users.length
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  components: {
    appbar,
    FarmTable,
    Myfooter,
  },
};
</script>
<style>
.pd {
  padding-bottom: 150px;
}
</style>
