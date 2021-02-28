<template>
  <div class="bg">
    <appbar />
    <center><h1>จัดการผู้ใช้</h1></center>
    <div class="container">
      <br><br>
      <Usertable class="pd" />
    </div>
    <Myfooter />
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import appbar from "@/components/appbar";
import Myfooter from "@/components/Myfooter";
import Usertable from "@/components/AdminManagerUser";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.$router.replace("/");
      } else {
        var displayName = user.displayName;
        this.$store.state.username = displayName;
      }
    });
  },
  methods: {
    getdata() {
      db.collection("Farm").onSnapshot((snapshot) => {
        var Farm = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          Farm.push(doc.data());
          this.$store.state.Farmnumber = Farm.length;
        });
      });
    },
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
  },
  created() {
    this.getdata();
    this.getAllBeeBox();
  },
  components: {
    appbar,
    Myfooter,
    Usertable,
  },
};
</script>

<style>
.barpd{
  padding-bottom: 50px;
}
.bg{
  background-color: #f8f9fa;
}
</style>
