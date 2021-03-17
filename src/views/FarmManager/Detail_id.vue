<template>
  <div>
    <appbar />

    <div class="container">
      <div>
        <v-card class="overflow-hidden" color="white">
          <v-toolbar flat color="grey lighten-2">
            <v-icon>mdi-barn</v-icon>
            <v-toolbar-title class="font-weight-light">
              ข้อมูลฟาร์ม
            </v-toolbar-title>
          </v-toolbar>
          <div class="container">
            <div>
              <v-row>
                <v-col sm="5" md="6">
                  <v-text-field
                    label="ชื่อฟาร์ม"
                    class="textfd textleft"
                    v-model="Name"
                    readonly
                  ></v-text-field
                ></v-col>
                <v-col sm="5" md="6">
                  <v-text-field
                    label="เจ้าของฟาร์ม"
                    class="textfd textleft"
                    v-model="Owner"
                    readonly
                  ></v-text-field
                ></v-col>
                <v-col sm="5" md="6">
                  <v-text-field
                    label="จำนวนกล่อง"
                    class="textfd textleft"
                    v-model="this.$store.state.Beebox"
                    readonly
                  ></v-text-field
                ></v-col>
                <v-col sm="5" md="6">
                  <v-text-field
                    label="เบอร์โทรศัพท์"
                    class="textfd textleft"
                    v-model="formatted"
                    readonly
                  ></v-text-field
                ></v-col>
                <v-col sm="5" md="6">
                  <v-text-field
                    label="ที่อยู่"
                    class="textfd textleft"
                    v-model="Address"
                    readonly
                  ></v-text-field
                ></v-col>
                <v-col sm="5" md="6">
                  <v-text-field
                    label="ชนิดแมลง"
                    class="textfd textleft"
                    v-model="Species"
                    readonly
                  ></v-text-field
                ></v-col>
              </v-row>
            </div>
          </div>
        </v-card>
      </div>

      <br><br>

      <BeeTable />
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
import BeeTable from "@/components/Beebox_ByfarmManager";
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
  data() {
    return {
      id: this.$route.params.Detail,
      Farm: [],
      Name: "",
      Owner: "",
      sbee: ["ผึ้งพันธ์"],
      formatted: "",
      Address:"",
      Species:""
    };
  },

  created() {
    this.getdata();
    this.$store.state.BeeboxByFarm = this.$route.params.Detail;
  },
  methods: {
    getdata() {
      /////////////getdata/////////////
      db.collection("Farm")
        .doc(this.id)
        .onSnapshot((doc) => {
          // console.log(doc.id, " => ", doc.data());

          this.Name = doc.data().Name;
          this.$store.state.FarmName = doc.data().Name;
          this.Address = doc.data().Address +
                " " +
                "ต." +
                doc.data().district +
                " อ." +
                doc.data().amphoe +
                " จ." +
                doc.data().province +
                " " +
                doc.data().zipcode,
          this.Species = doc.data().Species,
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
    BeeTable,
  },
};
</script>

<style>
#Mypad {
  padding: 20px;
}

#he {
  font-size: 30px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-color: #4158d0;
  background-image: linear-gradient(
    43deg,
    #4158d0 10%,
    #c850c0 57%,
    #e8980b 100%
  );
}
</style>
