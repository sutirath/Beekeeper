<template>
  <div>
    <v-card class="overflow-hidden" color="white">
      <v-toolbar flat color="grey lighten-2">
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light">
          User Profile
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" fab small @click="isEditing = !isEditing">
          <v-icon v-if="isEditing">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-pencil
          </v-icon>
        </v-btn>
      </v-toolbar>
      <div class="container">
        <div class="pdtable">
          <v-row>
            <v-col sm="5" md="6" v-if="isEditing">
              <v-select
                :items="items"
                label="คำนำหน้า"
                class="textfd textleft"
                v-model="Tname"
              ></v-select
            ></v-col>
            <v-col sm="5" md="6" v-if="isEditing">
              <v-text-field
                label="ชื่อ"
                class="textfd textleft"
                v-model="Fname"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6" v-if="isEditing">
              <v-text-field
                label="นาม-สกุล"
                class="textfd textleft"
                v-model="Lname"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6" v-if="!isEditing">
              <v-text-field
                label="ชื่อ"
                class="textfd textleft"
                :disabled="!isEditing"
                v-model="Name"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6">
              <v-text-field
                label="Uid"
                class="textfd"
                :disabled="true"
                v-model="Uid"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6">
              <v-text-field
                label="รหัสบัตรประชาชน"
                class="textfd"
                :disabled="!isEditing"
                v-model="IdCard"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6">
              <v-text-field
                label="อีเมลล์"
                class="textfd"
                :disabled="!isEditing"
                v-model="Email"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6">
              <v-text-field
                label="เบอร์โทรศัพท์"
                class="textfd"
                :disabled="!isEditing"
                v-model="Tel"
              ></v-text-field
            ></v-col>
            <v-col sm="5" md="6">
              <v-text-field
                label="ฟาร์ม"
                class="textfd"
                :disabled="true"
                v-model="FarmName"
              ></v-text-field
            ></v-col>
          </v-row>
        </div>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!isEditing" color="success" @click="save">
          Save
        </v-btn>
      </v-card-actions>
      <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
        Your profile has been updated
      </v-snackbar>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import { db } from "@/main";
export default {
  data() {
    return {
      hasSaved: false,
      isEditing: null,
      model: null,
      Users: [],
      items: [],
      Name: "",
      Uid: "",
      IdCard: "",
      Email: "",
      Tel: "",
      FarmName: "",
      Tname: "",
      Fname: "",
      Lname: "",
      IdFarm: "",
    };
  },
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

  created() {
    this.getAllTname();
  },

  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.abbr.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    save() {
      this.isEditing = !this.isEditing;
      if (
        this.Name.length == 0 ||
        this.IdCard.length == 0 ||
        this.Email.length == 0 ||
        this.Tel.length == 0 ||
        this.Tname.length == 0 ||
        this.Fname.length == 0 ||
        this.Lname.length == 0
      ) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        this.getUser(this.Uid);
      } else {
        this.Users = [];
        if (this.Tel[0] == "+") {
          var Pnumber = "+66" + this.Tel.substring(3);
        } else {
          var Pnumber = "+66" + this.Tel.substring(1);
        }
        // console.log(Pnumber);
        var qs = require("qs");
        var data = qs.stringify({
          email: this.Email,
          displayName: this.Tname + " " + this.Fname + " " + this.Lname,
          UserStatus: "User",
          farmName: this.FarmName,
          idFarm: this.IdFarm,
          phoneNumber: Pnumber,
          uid: this.Uid,
          IdCard: this.IdCard,
        });
        var config = {
          method: "put",
          url: "https://3.138.195.177:3000/UpdateUser",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: data,
        };
        axios(config)
          .then((response) => {
            // alert("Success");
            this.getUser(this.Uid);
            this.hasSaved = true;
          })
          .catch((error) => {
            alert(error);
          });
      }
    },
    getAllTname() {
      this.items = [];
      var docRef = db.collection("setting").doc("NameTitle");
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data()["index"]);
            doc.data()["index"].forEach((element) => {
              this.items.push(element);
              // console.log(element);
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },

    getUser(id) {
      var qs = require("qs");
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

          this.Name = response.data.displayName;
          this.Uid = response.data.uid;
          this.Email = response.data.email;
          this.Tel = response.data.phoneNumber;
          var N = this.Name.split(" ");
          this.Tname = N[0];
          this.Fname = N[1];
          this.Lname = N[2];
          this.Users.forEach((item) => {
            // console.log(item.customClaims.FarmName)
            this.IdCard = item.customClaims.IdCard;
            this.FarmName = item.customClaims.FarmName;
            this.IdFarm = item.customClaims.Farm;
          });
          // console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.textfd {
  width: 500px;
}
.textleft {
  text-align: left;
}
.pdtable{
  padding-left: 30px;
}
</style>
