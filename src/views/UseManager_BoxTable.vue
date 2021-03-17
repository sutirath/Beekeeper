<template>
  <div class="bg">
    <appbar />
    <center>
      <h1>จัดการกล่องเลี้ยงผึ้ง</h1>
    </center>
    <br /><br />
    <div class="container">
      <Boxtable />
      <br />
      <LocationsBee v-bind:Data="BeeBox"/>
    </div>
    <br /><br /><br /><br /><br /><br /><br />
    <Myfooter />
  </div>
</template>

<script>
import Boxtable from "../components/UserManagerBox";
import { db } from "@/main";
import firebase from "firebase";
import appbar from "@/components/appbar";
import Myfooter from "@/components/Myfooter";
import LocationsBee from "../components/UserBeeBox/LocationsBee";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      user.getIdTokenResult().then((idTokenResult) => {
        //   console.log(idTokenResult.claims.Farm)
        this.getBeeBox(idTokenResult.claims.Farm);
      });
    });
  },
  data() {
    return {
      BeeBox: [],
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
   getBeeBox(uid) {
      this.BeeBox = [];
      db.collection("BeeBox")
        .where("Idfarm", "==", uid)
        .onSnapshot((snapshot) => {
          this.BeeBox = [];
          snapshot.forEach((doc) => {
            this.BeeBox.push({
              id: doc.id,
              Created: doc.data().Created,
              Idfarm: doc.data().Idfarm,
              Name: doc.data().Name,
              num: doc.data().num,
              Species: doc.data().Species,
              LocationName: doc.data().LocationName,
            });
          });
        });
    },
  },
  created() {
    this.getdata();
  },
  components: {
    appbar,
    Myfooter,
    Boxtable,
    LocationsBee,
  },
};
</script>

<style>
.bg {
  background-color: #f8f9fa;
}
</style>
