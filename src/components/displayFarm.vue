<template>
  <div>
    <div class="container bgimg">
      <!-- <v-card class="mx-auto" max-width="1080" tile>
        <v-img
          max-height="290"
          src="../assets/BG_bee.jpg"
          style="border-radius: 10px"
        ></v-img>

        <v-row style="margin: 2.5%; position: absolute; top: 130px">
          <v-list-item>
            <v-list-item-avatar size="100">
              <v-avatar color="#E0E0E0" size="100">
                <span
                  ><v-img
                    max-height="50"
                    max-width="50"
                    src="../assets/farm.svg"
                  ></v-img
                ></span>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <h5 style="font-size: 1.5vw">{{ Owner }}</h5>
              <v-list-item-subtitle style="font-size: 1.2vw">{{
                Name
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-row>
      </v-card> -->

      <!-- /--------------------------------/ -->

      <v-card class="overflow-hidden farmpd" color="white">
        <v-toolbar flat color="grey lighten-2">
          <v-icon>mdi-farm</v-icon>
          <v-toolbar-title class="font-weight-light">
            ข้อมูลฟาร์ม
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="white" fab small @click="isEditing = !isEditing">
            <v-icon v-if="isEditing"> mdi-close </v-icon>
            <v-icon v-else> mdi-pencil </v-icon>
          </v-btn>
        </v-toolbar>
        <div class="container">
          <div class="pdtable">
            <v-row>
              <v-col sm="5" md="6">
                <v-text-field
                  label="ชื่อฟาร์ม"
                  class="textfd textleft"
                  :disabled="!isEditing"
                  v-model="Name"
                ></v-text-field
              ></v-col>
              <v-col sm="5" md="6" v-if="!isEditing">
                <v-text-field
                  label="เจ้าของฟาร์ม"
                  class="textfd"
                  :disabled="true"
                  v-model="Owner"
                ></v-text-field
              ></v-col>
              <v-col sm="5" md="6">
                <v-text-field
                  label="เลขมาตรฐานฟาร์ม"
                  class="textfd"
                  :disabled="!isEditing"
                  v-model="FarmStandardNumber"
                ></v-text-field
              ></v-col>
              <v-col sm="5" md="6" v-if="isEditing">
                <v-select
                  :items="TitleName"
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
                  label="ที่อยู่"
                  class="textfd"
                  :disabled="!isEditing"
                  v-model="address"
                ></v-text-field
              ></v-col>
              <v-col sm="5" md="6" v-if="isEditing">
                <v-text-field
                  label="บ้านเลขที่"
                  class="textfd"
                  v-model="address2"
                ></v-text-field>
              </v-col>
              <v-col sm="5" md="6" v-if="isEditing">
                <ThailandAutoComplete
                  v-model="district"
                  type="district"
                  @select="select"
                  placeholder="ตำบล..."
                />
              </v-col>
              <v-col sm="5" md="6" v-if="isEditing">
                <ThailandAutoComplete
                  v-model="amphoe"
                  type="amphoe"
                  @select="select"
                  color="#42b883"
                  placeholder="อำเภอ..."
                />
              </v-col>
              <v-col sm="5" md="6" v-if="isEditing">
                <ThailandAutoComplete
                  v-model="province"
                  type="province"
                  @select="select"
                  color="#35495e"
                  placeholder="จังหวัด..."
                />
              </v-col>
              <v-col sm="5" md="6" v-if="isEditing">
                <ThailandAutoComplete
                  v-model="zipcode"
                  type="zipcode"
                  @select="select"
                  color="#00a4e4"
                  placeholder="รหัสไปรษณีย์..."
                />
              </v-col>
              <v-col sm="5" md="6">
                <v-text-field
                  label="เบอร์โทรศัพท์"
                  class="textfd"
                  :disabled="!isEditing"
                  v-model="tel"
                ></v-text-field
              ></v-col>
              <v-col sm="5" md="6">
                <v-select
                  :items="BeeSCP"
                  :disabled="!isEditing"
                  label="ชนิดของแมลง"
                  v-model="Beespecies"
                ></v-select>
              </v-col>
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
        <v-snackbar color="green" v-model="hasSaved" :timeout="2000" absolute bottom left>
          อัพเดตสำเร็จ
        </v-snackbar>
      </v-card>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import ThailandAutoComplete from "vue-thailand-address-autocomplete";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          this.getdata(idTokenResult.claims.Farm);
          this.farmID = idTokenResult.claims.Farm;
        });
      } else {
        this.$router.replace("/");
      }
    });
  },
  data() {
    return {
      TitleName: [],
      hasSaved: false,
      isEditing: null,
      display_name: "",
      Owner: "",
      Name: "",
      Tname: "",
      Fname: "",
      Lname: "",
      address: "",
      tel: "",
      Beespecies: "",
      farmID: "",
      FarmStandardNumber: "",

      timeout: 2000,
      BeeSCP: [],

      address2: "",
      district: "",
      amphoe: "",
      province: "",
      zipcode: "",
    };
  },

  created() {
    this.getAllTname();
    this.getAllBeeSCP();
  },
  components: {
    ThailandAutoComplete,
  },
  methods: {
    getdata(id) {
      /////////////getdata/////////////
      db.collection("Farm")
        .doc(id)
        .onSnapshot((doc) => {
          // console.log(doc.id, " => ", doc.data());
          this.address =
            doc.data().Address +
            " " +
            doc.data().district +
            " อ." +
            doc.data().amphoe +
            " จ." +
            doc.data().province +
            " " +
            doc.data().zipcode;

          this.tel = doc.data().Tel;
          this.Beespecies = doc.data().Species;
          this.FarmStandardNumber = doc.data().FarmStandardNumber;

          this.address2 = doc.data().Address;
          this.district = doc.data().district;
          this.amphoe = doc.data().amphoe;
          this.province = doc.data().province;
          this.zipcode = doc.data().zipcode;

          this.Tname = doc.data().TitleName;
          this.Fname = doc.data().FirstName;
          this.Lname = doc.data().LastName;
          this.display_name = doc.data().FirstName;
          this.Name = doc.data().Name;
          this.Owner =
            doc.data().TitleName +
            doc.data().FirstName +
            " " +
            doc.data().LastName;
        });
    },
    getAllBeeSCP() {
      this.BeeSCP = [];
      var docRef = db.collection("setting").doc("BeeSpecies");
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data()["index"]);
            doc.data()["index"].forEach((element) => {
              this.BeeSCP.push(element);
              // console.log(element);
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },
    getAllTname() {
      this.TitleName = [];
      var docRef = db.collection("setting").doc("NameTitle");
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data()["index"]);
            doc.data()["index"].forEach((element) => {
              this.TitleName.push(element);
              // console.log(element);
            });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },
    save() {
      if (
        this.Name == "" ||
        this.Beespecies == "" ||
        this.tel == "" ||
        this.Tname == "" ||
        this.Fname == "" ||
        this.Lname == "" ||
        this.FarmStandardNumber == "" ||
        this.address2 == "" ||
        this.district == "" ||
        this.amphoe == "" ||
        this.province == "" ||
        this.zipcode == ""
      ) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        this.getdata(this.farmID);
      } else {
        var updateRef = db.collection("Farm").doc(this.farmID);
        return updateRef
          .update({
            Name: this.Name,
            TitleName: this.Tname,
            FirstName: this.Fname,
            LastName: this.Lname,

            Species: this.Beespecies,
            Tel: this.tel,
            FarmStandardNumber: this.FarmStandardNumber,

            Address: this.address2,
            district: this.district,
            amphoe: this.amphoe,
            province: this.province,
            zipcode: this.zipcode,
          })
          .then(() => {
            console.log("Document successfully updated!");
            this.getdata(this.farmID);
            // this.snackbar = true;
            this.hasSaved = true
            this.isEditing = !this.isEditing
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      }
    },
    select(address) {
      this.district = address.district;
      this.amphoe = address.amphoe;
      this.province = address.province;
      this.zipcode = address.zipcode;
    },
  },
};
</script>

<style>
#Mypad {
  padding: 20px;
}

.farmpd {
  margin-top: 70px;
}
</style>
