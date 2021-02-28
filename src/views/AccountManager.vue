<template>
  <div>
    <appbar />
    <center><h1>จัดการข้อมูลผู้ใช้</h1></center>
    <div class="container">
      <Usertable class="pduser"/>
    </div>
    <Myfooter />
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import appbar from "@/components/appbar";
import Myfooter from "@/components/Myfooter";
import Usertable from "@/components/UserManagerTable";
import axios from "axios";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.$router.replace("/");
      } else {
        this.getUser(user.uid);
        var displayName = user.displayName;
        this.$store.state.username = displayName;
      }
    });
  },
  data() {
    return {
      Users: [],
    };
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
    getUser(id) {
      var qs = require("qs");
      var AllUser = [];
      var data = qs.stringify({
        uid: id,
      });
      var config = {
        method: "post",
        url: "https://3.138.195.177:3000/getUser",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
      axios(config)
        .then((response) => {
          this.Users.push(response.data);
          // for (const item in response.data.users) {
          //   console.log(item)

          // }
        })
        .catch(function(error) {
          console.log(error);
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
.pduser{
  padding-bottom: 200px;
  padding-top: 50px;
}
</style>
