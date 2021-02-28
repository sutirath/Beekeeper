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

    <div>
      <v-dialog v-model="dialogReset" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            รีเซตรหัสผ่าน
          </v-card-title>
          <center>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="6">
                  <p>รหัสผ่านใหม่</p>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    style="width: 300px;"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-2"
                    hint="รหัสต้อง 8 ตัวอักษรขึ้นไป"
                    class="input-group--focused"
                    @click:append="show2 = !show2"
                    v-model="resetPass1"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <p>ยืนยันรหัสผ่านใหม่</p>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    style="width: 300px;"
                    :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[resetPass1 === resetPass2 || 'รหัสไม่ตรงกัน']"
                    :type="show3 ? 'text' : 'password'"
                    name="input-10-2"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append="show3 = !show3"
                    v-model="resetPass2"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </center>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="resetPass()">
              รีเซต
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

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
      :headers="headers"
      :items="Users"
      :search="search"
      sort-by="calories"
      class="elevation-1"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>จัดการผู้ใช้</v-toolbar-title>
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
                        :rules="emailRules"
                        v-model="email"
                        label="อีเมลล์"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="editedIndex == -1">
                      <v-text-field
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show2 ? 'text' : 'password'"
                        name="input-10-2"
                        label="รหัสผ่าน"
                        hint="At least 8 characters"
                        class="input-group--focused"
                        @click:append="show2 = !show2"
                        v-model="password"
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
                      <v-text-field
                        :rules="nameRules"
                        v-model="Fname"
                        label="ชื่อ"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :rules="nameRules"
                        v-model="Lname"
                        label="นามสกุล"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :rules="[rules.required, rules.checkidcard]"
                        v-model="IdCard"
                        label="รหัสบัตรประชาชน"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :rules="nameRules"
                        :items="Usta"
                        label="สถานะ"
                        v-model="UserStatus"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :rules="[
                          rules.required,
                          rules.Telrule1,
                          rules.Telrule2,
                        ]"
                        v-model="tel"
                        label="เบอร์โทรศัพท์"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="UserStatus == 'User'">
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
                <v-btn color="blue darken-1" text @click="save">เพิ่ม</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.uid="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="resetPassword(item)">mdi-key</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import axios from "axios";
import validThaiID from "thai-id-validator";
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
    IdCard: "",
    resetPass1: "",
    resetPass2: "",
    dialogReset: false,
    show2: false,
    show3: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "รหัสต้อง 8 ตัวขึ้นไป",
      emailMatch: () => `The email and password you entered don't match`,
      Telrule1: (v) => v.length >= 10 || "เบอร์โทรต้อง 10 ตัว",
      Telrule2: (v) => v[0] == 0 || "ไม่ใช่เบอร์โทร",
      checkidcard: (v) => validThaiID(v) || "ไม่ใช่รหัสบัตรประชาชน",
    },
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length >= 1 || "ชื่อของคุญสั้นเกินไป",
    ],
    dialogFarm: false,
    UserStatus: "",
    selectFarm_id: "",
    selectFarm_name: "",
    Address: "",
    district: "",
    amphoe: "",
    province: "",
    zipcode: "",
    search: "",
    Farm: [],
    Users: [],
    dialog: false,
    TitleName:[],
    Usta: ["User", "Admin"],
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
        value: "displayName",
      },
      {
        text: "อีเมลล์",
        value: "email",
      },
      {
        text: "เลขบัตรประชาชน",
        value: "customClaims.IdCard",
      },
      {
        text: "เบอร์โทรศัพท์",
        value: "phoneNumber",
      },
      {
        text: "สถานะ",
        value: "customClaims.User",
        sortable: false,
      },
      {
        text: "ฟาร์ม",
        value: "customClaims.FarmName",
      },
      {
        text: "Actions",
        value: "uid",
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
    tel: "",
    editid: "",
    email: "",
    password: "",
    uid: "",
    resetid: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้" : "แก้ผู้ใช้";
    },
    passwordConfirmationRule() {
      return this.resetPass1 !== this.resetPass2 || "Password must match";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.getAllUser();
    this.getFarmData();
    this.getAllTname();
  },

  methods: {
    getFarmData() {
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

    resetPassword(item) {
      this.dialogReset = true;
      this.resetid = item.uid;
    },
    resetPass() {
      var qs = require("qs");
      var data = qs.stringify({
        uid: this.resetid,
        password: this.resetPass2,
      });
      var config = {
        method: "put",
        url: "https://3.138.195.177:3000/reSetPassword",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
      axios(config)
        .then((response) => {
          console.log(response);
          this.snackbar = true;
          this.getAllUser();
          this.close();
        })
        .catch((error) => {
          alert(error);
        });
    },
    SelectFarm(item) {
      this.selectFarm_id = item.id;
      this.selectFarm_name = item.Name;
      this.dialogFarm = false;
    },

    select(address) {
      this.district = address.district;
      this.amphoe = address.amphoe;
      this.province = address.province;
      this.zipcode = address.zipcode;
    },

    editItem(item) {
      this.uid = item.uid;
      var n = item.displayName;
      var Name = n.split(" ");
      this.editedIndex = this.Users.indexOf(item);
      this.tel = item.phoneNumber;
      this.email = item.email;
      this.Tname = Name[0];
      this.UserStatus = item.customClaims.User;
      this.Fname = Name[1];
      this.Lname = Name[2];
      this.IdCard = item.customClaims.IdCard;
      this.selectFarm_name;
      this.selectFarm_id;

      this.dialog = true;
    },

    deleteItem(item) {
      this.Users = [];
      console.log(item.uid);
      var qs = require("qs");
      var data = qs.stringify({
        uid: item.uid,
      });
      var config = {
        method: "delete",
        url: "https://3.138.195.177:3000/DeleteUser",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
      const index = this.Users.indexOf(item);
      confirm("Are you sure you want to delete ?") &&
        axios(config)
          .then((response) => {
            this.getAllUser();
            this.snackbar = true;
          })
          .catch(function(error) {
            console.log(error);
          });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.email = "";
        this.Tname = "";
        this.Fname = "";
        this.Lname = "";
        this.UserStatus = "";
        this.selectFarm_name = "";
        this.tel = "";
        this.editedIndex = -1;
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
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },

    getAllUser() {
      var qs = require("qs");
      var AllUser = [];
      var data = qs.stringify({});
      var config = {
        method: "get",
        url: "https://3.138.195.177:3000/getAllUser",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };
      axios(config)
        .then((response) => {
          this.Users = response.data.users;
          // for (const item in response.data.users) {
          //   console.log(item)
          // this.Users = response.data.users
          // }
          this.$store.state.AllUser = JSON.stringify(
            response.data.users.length
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    save() {
      this.Users = [];
      if (this.editedIndex === -1) {
        if (
          this.email.length == 0 ||
          this.password.length == 0 ||
          this.Tname.length == 0 ||
          this.Fname.length == 0 ||
          this.Lname.length == 0 ||
          this.UserStatus.length == 0 ||
          this.selectFarm_name.length == 0 ||
          this.tel.length == 0 ||
          this.IdCard.length == 0
        ) {
          alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
          this.getAllUser();
          this.close();
        } else {
          var Pnumber = "+66" + this.tel.substring(1);
          console.log(Pnumber);
          var qs = require("qs");
          var data = qs.stringify({
            email: this.email,
            password: this.password,
            displayName: this.Tname + " " + this.Fname + " " + this.Lname,
            UserStatus: this.UserStatus,
            farmName: this.selectFarm_name,
            idFarm: this.selectFarm_id,
            phoneNumber: Pnumber,
            IdCard: this.IdCard,
          });
          var config = {
            method: "post",
            url: "https://3.138.195.177:3000/CreateUser",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          };
          axios(config)
            .then((response) => {
              this.snackbar = true;
              this.getAllUser();
              this.close();
            })
            .catch((error) => {
              alert(error);
            });
        }
      } else {
        if (
          this.email.length == 0 ||
          this.Tname.length == 0 ||
          this.Fname.length == 0 ||
          this.Lname.length == 0 ||
          this.UserStatus.length == 0 ||
          this.selectFarm_name.length == 0 ||
          this.tel.length == 0 ||
          this.IdCard.length == 0
        ) {
          alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
          this.getAllUser();
          this.close();
        } else {
          this.Users = [];
          if (this.tel[0] == "+") {
            var Pnumber = "+66" + this.tel.substring(3);
          } else {
            var Pnumber = "+66" + this.tel.substring(1);
          }
          console.log(Pnumber);
          var qs = require("qs");
          var data = qs.stringify({
            email: this.email,
            displayName: this.Tname + " " + this.Fname + " " + this.Lname,
            UserStatus: this.UserStatus,
            farmName: this.selectFarm_name,
            idFarm: this.selectFarm_id,
            phoneNumber: Pnumber,
            uid: this.uid,
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
              this.snackbar = true;
              this.getAllUser();
              this.close();
            })
            .catch((error) => {
              alert(error);
            });
        }
      }
    },
  },
};
</script>
