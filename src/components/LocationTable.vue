<template>
  <div>
    <v-dialog v-model="dialogFarm" transition="dialog-bottom-transition">
      <template>
        <v-card>
          <v-toolbar color="primary" dark>กรุณาเลือกฟาร์ม</v-toolbar>

          <div>
            <v-data-table
              :headers="headersFarm"
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
                </v-toolbar>
              </template>

              <template v-slot:item.id="{ item }">
                <v-icon small class="mr-2" @click="SelectFarm(item)"
                  >mdi-check-circle</v-icon
                >
              </template>
            </v-data-table>
          </div>

          <v-card-actions class="justify-end">
            <v-btn text @click="dialogFarm = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <v-data-table
      :headers="headersFarm"
      :items="Farm"
      :search="search"
      loading-text="........"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>เลือกฟาร์ม</v-toolbar-title>
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
                        label="ชื่อจุด"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="วันเดือนปี"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          @input="menu2 = false"
                          locale="th-th"
                        ></v-date-picker>
                      </v-menu>
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
                      <v-select
                        :items="Purpose"
                        label="สถานะ"
                        v-model="status"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="food"
                        label="พืชอาหาร"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="selectFarm_name"
                        label="เลือกฟาร์ม"
                        @click="dialogFarm = true"
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
        <!-- <v-icon small class="mr-2" @click="detail(item)"
          >mdi-check-circle</v-icon
        > -->
        <v-btn
          @click="detail(item)"
          class="mx-2"
          fab
          dark
          x-small
          color="primary"
        >
          <v-icon dark> mdi-check-bold </v-icon>
        </v-btn>
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
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    dialogFarm: false,
    Address: "",
    district: "",
    amphoe: "",
    province: "",
    zipcode: "",
    search: "",
    Farm: [],
    Locations: [],
    dialog: false,
    Purpose: ["เก็บผล", "พักผึ้ง"],
    headersFarm: [
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
        text: "พันธ์ุผึ้ง",
        value: "Species",
      },
      {
        text: "Actions",
        value: "id",
        sortable: false,
      },
    ],
    headers: [
      {
        text: "ชื่อ",
        align: "start",
        sortable: false,
        value: "Name",
      },
      {
        text: "วันเดือนปี",
        value: "date",
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
        text: "อาหาร",
        value: "food",
      },
      {
        text: "สถานะ",
        value: "status",
      },
      {
        text: "ฟาร์ม",
        value: "farmName",
      },
      {
        text: "Actions",
        value: "id",
        sortable: false,
      },
    ],
    editedIndex: -1,
    Name: "",
    editid: "",
    status: "",
    food: "",
    selectFarm_name: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มจุดที่ตั้ง" : "แก้ไขจุดที่ตั้ง";
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
    this.getLocations();
  },

  methods: {
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
            Owner:
              doc.data().TitleName +
              doc.data().FirstName +
              " " +
              doc.data().LastName,
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
    getLocations() {
      /////////////getdata/////////////
      db.collection("LocationBox").onSnapshot((snapshot) => {
        this.Locations = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());

          this.Locations.push({
            id: doc.id,
            Name: doc.data().name,
            farmName: doc.data().Farmname,
            IdFarm: doc.data().IdFarm,
            status: doc.data().status,
            date: doc.data().date,
            food: doc.data().food,
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
      console.log(item.id);
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
        name: "locationdetail",
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
        this.Owner == "" ||
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
              alert("Success");
              this.close();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
          // .then((docref) => {
          //   console.log("Document written with ID: ", docRef.id);
          //   addDataUser(docRef.id);
          //   alert("Success");
          //   this.close();
          // })
          // .catch((error) => {
          //   console.error("Error updating document: ", error);
          // });
        } else {
          var updateRef = db.collection("Farm").doc(this.editid);
          this.Owner = this.Tname + this.Fname + " " + this.Lname;
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
              alert("Success");
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
