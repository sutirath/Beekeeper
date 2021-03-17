<template>
  <div>
    <div class="container">
      <appbar />
      <v-row>
        <v-col lg="4" cols="sm" class="pb-2">
          <v-card>
            <v-row class="no-gutters">
              <div class="col-auto">
                <div class="cyan fill-height">&nbsp;</div>
              </div>
              <div class="col pa-3 py-4 cyan--text">
                <h5 class="text-truncate text-uppercase">จำนวนฟาร์ม</h5>
                <h1>{{ $store.state.Farmnumber }}</h1>
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
                <h5 class="text-truncate text-uppercase">จำนวนผู้ใช้งาน</h5>
                <h1>{{ this.$store.state.AllUser }}</h1>
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
                <h5 class="text-truncate text-uppercase">จำนวนกล่องผึ้ง</h5>
                <h1>{{ this.$store.state.AllBeeBox }}</h1>
              </div>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <div class="container">
        <v-row>
          <v-col lg="6" cols="sm" md="6">
            <center><h3>ความถูกต้องของระบบ</h3></center>
            <ACDash v-bind:Data="History" />
          </v-col>
          <v-col lg="6" cols="sm" md="6">
            <center><h3>กล่องเลี้ยงผึ้ง</h3></center>
            <BBDash v-bind:Data="BeeBox"/>
          </v-col>
        </v-row>
      </div>
      <div>
        <br />
        <br />
        <br />
        <DataTable
          v-bind:Farm="Farm"
          v-bind:BeeBox="BeeBox"
          v-bind:AllUser="AllUser"
          class="pd"
        />
      </div>
    </div>
    <Myfooter />
  </div>
</template>

<script>
import firebase from "firebase";
import appbar from "../components/appbar";
import DataTable from "../components/DataTable";
import Myfooter from "../components/Myfooter";
import { db } from "@/main";
import axios from "axios";
import ACDash from "../components/Dashboard_admin/Accuracy_Dash";
import BBDash from '../components/Dashboard_admin/Beebox_Dash'
export default {
  name: "Home",
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var displayName = user.displayName;
        var Uid = user.uid;
        this.$store.state.username = displayName;
        this.$store.state.Uid = Uid;
      } else {
        this.$router.replace("/");
      }
    });
  },
  data() {
    return {
      Farm: [],
      BeeBox: [],
      AllUser: [],
      History: [],
    };
  },
  created() {
    this.getdata();
    this.getAllBeeBox();
    this.getAllUser();
    this.getAllHistory();
  },
  components: {
    appbar,
    DataTable,
    Myfooter,
    ACDash,
    BBDash,
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
        this.Farm = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          this.Farm.push(doc.data());
          this.$store.state.Farmnumber = this.Farm.length;
        });
      });
    },
    getAllBeeBox() {
      db.collection("BeeBox").onSnapshot((snapshot) => {
        this.BeeBox = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          this.BeeBox.push(doc.data());
          this.$store.state.AllBeeBox = this.BeeBox.length;
        });
      });
    },
    getAllHistory() {
      db.collection("History").onSnapshot((snapshot) => {
        this.History = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          this.History.push(doc.data());
        });
      });
    },
    getAllUser() {
      var qs = require("qs");
      this.AllUser = [];
      var data = qs.stringify({});
      var config = {
        method: "get",
        url: "https://3.138.195.177:3000/getAllUser",
        headers: {},
        data: data,
      };
      axios(config)
        .then((response) => {
          this.AllUser = response.data.users;
          this.$store.state.AllUser = JSON.stringify(
            response.data.users.length
          );
        })
        .catch(function (error) {
          console.log(error);
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
</style>
