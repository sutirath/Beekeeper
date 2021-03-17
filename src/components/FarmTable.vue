<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="2000" right rounded="pill" top color="green">
      บันทึกข้อมูลสำเร็จ

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-data-table
      :headers="headers"
      :items="Farm"
      :search="search"
      loading-text="........"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>จัดการฟาร์ม</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >เพิ่ม</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="Name"
                        label="ชื่อฟาร์ม"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="FarmStandardNumber"
                        label="เลขมาตราฐานฟาร์ม"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="TitleName"
                        label="คำนำหน้าชื่อ"
                        v-model="Tname"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="Fname" label="ชื่อ"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="Lname"
                        label="นามสกุล"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="BeeSCP"
                        label="ชนิดของแมลง"
                        v-model="Species"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="Address"
                        label="บ้านเลขที่"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div>
                        <ThailandAutoComplete
                          v-model="district"
                          type="district"
                          @select="select"
                          label="ตำบล"
                          placeholder="ตำบล..."
                        />
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <ThailandAutoComplete
                        v-model="amphoe"
                        type="amphoe"
                        @select="select"
                        label="อำเภอ"
                        color="#42b883"
                        placeholder="อำเภอ..."
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <ThailandAutoComplete
                        v-model="province"
                        type="province"
                        @select="select"
                        label="จังหวัด"
                        color="#35495e"
                        placeholder="จังหวัด..."
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <ThailandAutoComplete
                        v-model="zipcode"
                        type="zipcode"
                        @select="select"
                        label="รหัสไปรษณีย์"
                        color="#00a4e4"
                        placeholder="รหัสไปรษณีย์..."
                      />
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="Tel"
                        label="เบอร์โทรศัพท์"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">ยกเลิก</v-btn>
                <v-btn color="blue darken-1" text @click="save">บันทึก</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.id="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon small @click="detail(item)">mdi-account-details</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import ThailandAutoComplete from "vue-thailand-address-autocomplete";
import axios from "axios";
export default {
  name: "App",
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
  data: () => ({
    snackbar: false,
    FarmStandardNumber: "",
    Address: "",
    district: "",
    amphoe: "",
    province: "",
    zipcode: "",
    search: "",
    Farm: [],
    dialog: false,
    TitleName: [],
    BeeSCP: [],
    headers: [
      {
        text: "ชื่อ ฟาร์ม",
        align: "start",
        sortable: false,
        value: "Name",
      },
      {
        text: "เจ้าของ",
        value: "Owner",
      },
      {
        text: "เบอร์โทรศัพท์",
        value: "Tel",
      },
      {
        text: "ที่อยู่",
        value: "Address",
      },
      {
        text: "ตำบล",
        value: "district",
      },
      {
        text: "อำเภอ",
        value: "amphoe",
      },
      {
        text: "จังหวัด",
        value: "province",
      },
      {
        text: "รหัสไปรษณี",
        value: "zipcode",
      },
      {
        text: "ชนิดแมลง",
        value: "Species",
      },
      {
        text: "Actions",
        value: "id",
        sortable: false,
      },
    ],
    editedIndex: -1,

    Name: "",
    Tname: "",
    Fname: "",
    Owner: "",
    Lname: "",
    Species: "",
    Tel: "",
    editid: "",
    email: "",
    password: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มฟาร์ม" : "แก้ไขฟาร์ม";
    },
  },
  components: {
    ThailandAutoComplete,
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.getData();
    this.getAllTname();
    this.getAllBeeSCP();
  },

  methods: {
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
    getData() {
      /////////////getdata/////////////
      db.collection("Farm").onSnapshot((snapshot) => {
        this.Farm = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());

          this.Farm.push({
            id: doc.id,
            Location: doc.data().Location,
            Name: doc.data().Name,
            FarmStandardNumber: doc.data().FarmStandardNumber,
            TitleName: doc.data().TitleName,
            Fname: doc.data().FirstName,
            Lname: doc.data().LastName,
            Species: doc.data().Species,
            Location: doc.data().Location,
            Tel: doc.data().Tel,
            Address: doc.data().Address,
            district: doc.data().district,
            amphoe: doc.data().amphoe,
            province: doc.data().province,
            zipcode: doc.data().zipcode,
          });
          this.$store.state.Farmnumber = this.Farm.length;
        });
      });
    },
    select(address) {
      this.district = address.district;
      this.amphoe = address.amphoe;
      this.province = address.province;
      this.zipcode = address.zipcode;
    },

    editItem(item) {
      this.editedIndex = this.Farm.indexOf(item);
      // this.editedItem = Object.assign({}, item);

      this.Name = item.Name;
      this.Owner = item.Owner;
      this.Species = item.Species;
      this.Tel = item.Tel;
      this.Tname = item.TitleName;
      this.Fname = item.Fname;
      this.Lname = item.Lname;
      this.FarmStandardNumber = item.FarmStandardNumber;
      this.Address = item.Address;
      this.district = item.district;
      this.amphoe = item.district;
      this.province = item.province;
      this.zipcode = item.zipcode;

      this.editid = item.id;
      console.log(item.FarmStandardNumber);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editid = item.id;
      const index = this.Farm.indexOf(item);
      confirm("Are you sure you want to delete ?") &&
        db
          .collection("Farm")
          .doc(this.editid)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
    },
    detail(item) {
      this.editedIndex = this.Farm.indexOf(item);
      // console.log(item.id);
      this.$router.push({
        name: "Detail",
        params: {
          Detail: item.id,
        },
      });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.Name = "";
        this.Owner = "";
        this.Species = "";
        this.Tel = "";
        this.Tname = "";
        this.Fname = "";
        this.Lname = "";
        this.FarmStandardNumber = "";
        this.Address = "";
        this.district = "";
        this.amphoe = "";
        this.province = "";
        this.zipcode = "";
        this.editedIndex = -1;
      });
    },
    save() {
      this.Farm = [];
      if (
        this.Name == "" ||
        this.Species == "" ||
        this.Tel == "" ||
        this.Tname == "" ||
        this.Fname == "" ||
        this.Lname == "" ||
        this.FarmStandardNumber == "" ||
        this.Address == "" ||
        this.district == "" ||
        this.amphoe == "" ||
        this.province == "" ||
        this.zipcode == ""
      ) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        this.getData();
        this.close();
      } else {
        if (this.editedIndex === -1) {
          db.collection("Farm")
            .add({
              Name: this.Name,
              TitleName: this.Tname,
              FirstName: this.Fname,
              LastName: this.Lname,
              Species: this.Species,
              Tel: this.Tel,
              FarmStandardNumber: this.FarmStandardNumber,
              Address: this.Address,
              district: this.district,
              amphoe: this.amphoe,
              province: this.province,
              zipcode: this.zipcode,
            })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              this.snackbar = true;
              this.close();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        } else {
          var updateRef = db.collection("Farm").doc(this.editid);
          return updateRef
            .update({
              Name: this.Name,
              TitleName: this.Tname,
              FirstName: this.Fname,
              LastName: this.Lname,
              Species: this.Species,
              Tel: this.Tel,
              FarmStandardNumber: this.FarmStandardNumber,
              Address: this.Address,
              district: this.district,
              amphoe: this.amphoe,
              province: this.province,
              zipcode: this.zipcode,
            })
            .then(() => {
              console.log("Document successfully updated!");
              this.snackbar = true;
              this.close();
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        }
      }
    },
  },
};
</script>
