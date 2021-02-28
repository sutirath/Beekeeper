<template>
  <div class="bg">
    <appbar />
      <center><h1>จัดการข้อมูลฟาร์ม</h1></center>
    <div class="container">
      <displayFarm />
      <br /><br />
      <v-divider></v-divider>
      <br /><br />
    </div>
    <br />
    <br />
    <br /><br /><br /><br />
    <Myfooter />
  </div>
</template>

<script>
import appbar from "@/components/appbar";
import { db } from "@/main";
import firebase from "firebase";
import Myfooter from "@/components/Myfooter";
import displayFarm from "@/components/displayFarm";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          this.getdata(idTokenResult.claims.Farm);
        });
      } else {
        this.$router.replace("/");
      }
    });
  },
  data() {
    return {
      Farm: [],
      Name: "",
      Owner: "",
      sbee: ["ผึ้งพันธ์"],
      formatted: "",
    };
  },

  methods: {
    getdata(id) {
      /////////////getdata/////////////
      db.collection("Farm")
        .doc(id)
        .onSnapshot((doc) => {
          // console.log(doc.id, " => ", doc.data());

          this.Name = doc.data().Name;
          (this.Owner =
            doc.data().TitleName +
            doc.data().FirstName +
            " " +
            doc.data().LastName),
            this.Farm.push({
              id: doc.id,
              Location: doc.data().Location,
              Name: doc.data().Name,
              Owner:
                doc.data().TitleName +
                doc.data().FirstName +
                " " +
                doc.data().LastName,
              Species: doc.data().Species,
              Address:
                doc.data().Address +
                " " +
                "ต." +
                doc.data().district +
                " อ." +
                doc.data().amphoe +
                " จ." +
                doc.data().province +
                " " +
                doc.data().zipcode,
              Tel: doc.data().Tel,
            });
          var phone = doc.data().Tel;
          this.formatted =
            phone.substr(0, 3) +
            "-" +
            phone.substr(3, 3) +
            "-" +
            phone.substr(6, 4);
        });
    },
  },

  components: {
    appbar,
    Myfooter,
    displayFarm,
  },
};
</script>

<style>
#Mypad {
  padding: 20px;
}

.bg{
  background-color: #f8f9fa;
}
.mytable{
  padding-bottom: 30px;
}
</style>
