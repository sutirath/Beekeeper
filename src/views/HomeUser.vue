<template>
  <div class="bg">
    <div class="container">
      <appbar />
      <center><h1>แดชบอร์ด</h1></center>
      <br /><br />
      <v-row>
        <v-col lg="4" cols="sm" class="pb-2">
          <v-card>
            <v-row class="no-gutters">
              <div class="col-auto">
                <div class="cyan fill-height">&nbsp;</div>
              </div>
              <div class="col pa-3 py-4 cyan--text">
                <h5 class="text-truncate text-uppercase">จำนวนกล่องผึ้ง</h5>
                <h1>{{ BeeBox.length }}</h1>
              </div>
            </v-row>
          </v-card>
        </v-col>
        <v-col lg="4" cols="sm" class="pb-2">
          <v-card>
            <v-row class="no-gutters">
              <div class="col-auto">
                <div class="primary fill-height">&nbsp;</div>
              </div>
              <div class="col pa-3 py-4 primary--text">
                <h5 class="text-truncate text-uppercase">จำนวนจุดที่ตั้ง</h5>
                <h1>{{ Locations.length }}</h1>
              </div>
            </v-row>
          </v-card>
        </v-col>
        <v-col lg="4" cols="sm" class="pb-2">
          <v-card>
            <v-row class="no-gutters">
              <div class="col-auto">
                <div class="success fill-height">&nbsp;</div>
              </div>
              <div class="col pa-3 py-4 success--text">
                <h5 class="text-truncate text-uppercase">ประวัติการบันทึก</h5>
                <h1>{{ History.length }}</h1>
              </div>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <br /><br />

      <div class="container">
        <v-row>
          <v-col lg="6" cols="sm" md="6">
            <center><h3>จำนวนกล่องผึ้งต่อจุด</h3></center>
            <chartLocations v-bind:Data="BeeBox" />
          </v-col>
          <!-- <v-col lg="6" cols="sm" md="6">
            <center><h3>ผลการทำนาย</h3></center>
            <accuracyChart v-bind:Data="History" />
          </v-col> -->
          <v-col lg="6" cols="sm" md="6">
            <center><h3>ภาพรวมฟาร์ม</h3></center>
            <classChart v-bind:Data="History" />
          </v-col>
        </v-row>
      </div>
      <!-- <div class="container">
        <v-card elevation="0" max-width="500">
          <br />
          <center><h3>ภาพรวมฟาร์ม</h3></center>
          <br />
          <classChart v-bind:Data="History" />
        </v-card>
      </div> -->

      <div style="padding-bottom: 45px">
        <BeeboxTable v-bind:BeeBox="BeeBox" />
      </div>

      <div style="padding-bottom: 45px">
        <locations v-bind:Locations="Locations" />
      </div>

      <div style="padding-bottom: 100px">
        <HistoryTable v-bind:Historys="History" />
      </div>

      <br />
      <br />
      <br />
    </div>
    <Myfooter />
  </div>
</template>

<script>
import firebase from "firebase";
import appbar from "../components/appbar";
import Myfooter from "../components/Myfooter";
import { db } from "@/main";
import BeeboxTable from "../components/Home/Beebox";
import systemstatus from "../components/Home/SystemStatus";
import locations from "../components/Home/Locationresult";
import HistoryTable from "../components/Home/History";
import chartLocations from "../components/Dashboard_Users/locationDash";
import accuracyChart from "../components/Dashboard_Users/AccuracyChart";
import classChart from "../components/Dashboard_Users/ClassChart";

export default {
  name: "Home",
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var displayName = user.displayName;
        var Uid = user.uid;
        this.$store.state.username = displayName;
        this.$store.state.Uid = Uid;
        user.getIdTokenResult().then((idTokenResult) => {
          this.getAllBeeBox(idTokenResult.claims.Farm);
          this.getAllLocations(idTokenResult.claims.Farm);
          this.getAllHistory(idTokenResult.claims.Farm);
        });
      } else {
        this.$router.replace("/");
      }
    });
  },
  data() {
    return {
      BeeBox: [],
      Locations: [],
      History: [],
    };
  },
  components: {
    appbar,
    Myfooter,
    BeeboxTable,
    systemstatus,
    locations,
    HistoryTable,
    chartLocations,
    accuracyChart,
    classChart,
  },
  created() {
    this.getdata();
  },
  methods: {
    signout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/");
        });
    },
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
    getAllBeeBox(id) {
      db.collection("BeeBox")
        .where("Idfarm", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            this.BeeBox.push(doc.data());
            this.BeeBox.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(a.Name) - new Date(b.Name);
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    getAllLocations(id) {
      db.collection("LocationBox")
        .where("IdFarm", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            this.Locations.push(doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
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
.myshadows {
  box-shadow: 0px 0px 10px -1px rgba(0, 0, 0, 0.16);
  margin-top: 30px;
}
.boxsha {
  -webkit-box-shadow: 0px 0px 18px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 18px -8px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 13px -8px rgba(0, 0, 0, 0.75);
  border-radius: 10px;
}
.pdft {
  padding-bottom: 45px;
  padding-top: 50px;
}
.bg {
  background-color: #f8f9fa;
}
</style>
