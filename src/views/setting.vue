<template>
  <div>
    <appbar />

    <v-snackbar
      v-model="snackbar2"
      :timeout="2000"
      right
      color="red"
      rounded="pill"
      top
    >
      กรุณากรอกข้อมูลให้ครบถ้วน

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar2 = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="snackbar3"
      :timeout="2000"
      right
      color="red"
      rounded="pill"
      top
    >
      คุณยังไม่ได้ใส่ไฟล์

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar3 = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>

    <center><h1>ตั้งค่าระบบ</h1></center>

    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      right
      rounded="pill"
      top
      color="green"
    >
      บันทึกข้อมูลสำเร็จ

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <div class="container">
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="dialog"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>แก้ไข</v-toolbar>
            <v-card-text>
              <br /><br />
              <v-text-field
                label="Solo"
                placeholder="Placeholder"
                solo
                v-model="editText"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">ปิด</v-btn>
              <v-btn text @click="save()">บันทึก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

      <div class="panelpd">
        <v-expansion-panels multiple>
          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>แจ้งเตือนระบบ</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="systemStatus"
                :sort-by="['Date']"
                :sort-desc="[true]"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.type="{ item }">
                  <v-chip :color="getColor(item.type)" dark>
                    {{ item.type }}
                  </v-chip>
                </template>
              </v-data-table>
              <br />

              <br />
              <div class="container">
                <center>
                  <v-text-field
                    placeholder="หัวข้อ"
                    outlined
                    v-model="titleStatus"
                  ></v-text-field>
                  <v-textarea
                    placeholder="เนื้อหา"
                    auto-grow
                    outlined
                    rows="3"
                    row-height="25"
                    shaped
                    v-model="detailStatus"
                  ></v-textarea>
                  <v-select
                    :items="items"
                    label="เลือกชนิด"
                    outlined
                    v-model="typeStatus"
                  ></v-select>
                  <v-btn
                    depressed
                    color="success"
                    @click="updateStatus()"
                    small
                  >
                    อัพเดตงานระบบ
                  </v-btn>
                </center>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>ตั้งค่าคำนำหน้าชื่อ</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                justify="space-around"
                v-for="item in TitleName"
                :key="item.index"
              >
                <v-col cols="12" md="6">
                  <v-chip class="ma-2">
                    {{ item }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    depressed
                    color="error"
                    @click="deleteTitleName(item)"
                    small
                  >
                    ลบ
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    depressed
                    color="primary"
                    @click="editItem(item, 'T')"
                    small
                  >
                    แก้ไข
                  </v-btn>
                </v-col>
              </v-row>
              <br />
              <v-divider></v-divider>
              <br />
              <div class="container">
                <center>
                  <v-text-field
                    label="Solo"
                    placeholder="เพิ่มคำนำหน้า"
                    solo
                    v-model="add_titleName"
                  ></v-text-field>
                  <v-btn depressed color="success" @click="addData('T')" small>
                    เพิ่ม
                  </v-btn>
                </center>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>ตั้งค่าพันธุ์ผึ้ง</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                justify="space-around"
                v-for="item in BeeSCP"
                :key="item.index"
              >
                <v-col cols="12" md="6">
                  <v-chip class="ma-2">
                    {{ item }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    depressed
                    color="error"
                    @click="deleteBeeSCP(item)"
                    small
                  >
                    ลบ
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    depressed
                    color="primary"
                    @click="editItem(item, 'B')"
                    small
                  >
                    แก้ไข
                  </v-btn>
                </v-col>
              </v-row>
              <br />
              <v-divider></v-divider>
              <br />
              <div class="container">
                <center>
                  <v-text-field
                    label="Solo"
                    placeholder="เพิ่มพันธุ์ผึ้ง"
                    solo
                    v-model="add_BeeSCP"
                  ></v-text-field>
                  <v-btn depressed color="success" @click="addData('B')" small>
                    เพิ่ม
                  </v-btn>
                </center>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>ตั้งค่าคลาส</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                justify="space-around"
                v-for="item in ClassName"
                :key="item.index"
              >
                <v-col cols="12" md="6">
                  <v-chip class="ma-2">
                    {{ item }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    depressed
                    color="error"
                    @click="deleteClassName(item)"
                    small
                  >
                    ลบ
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    depressed
                    color="primary"
                    @click="editItem(item, 'C')"
                    small
                  >
                    แก้ไข
                  </v-btn>
                </v-col>
              </v-row>
              <br />
              <v-divider></v-divider>
              <br />
              <div class="container">
                <center>
                  <v-text-field
                    label="Solo"
                    placeholder="เพิ่มคลาส"
                    solo
                    v-model="add_classname"
                  ></v-text-field>
                  <v-btn depressed color="success" @click="addData('C')">
                    เพิ่ม
                  </v-btn>
                </center>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              ><h3>ตั้งค่าAI</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div>
                <v-file-input
                  v-model="files"
                  color="deep-purple accent-4"
                  counter
                  label="File input"
                  multiple
                  placeholder="New Model AI"
                  prepend-icon="mdi-paperclip"
                  outlined
                  :show-size="1000"
                  @change="getFileData()"
                >
                  <template v-slot:selection="{ index, text }">
                    <v-chip
                      v-if="index < 2"
                      color="deep-purple accent-4"
                      dark
                      label
                      small
                    >
                      {{ text }}
                    </v-chip>

                    <span
                      v-else-if="index === 2"
                      class="overline grey--text text--darken-3 mx-2"
                    >
                      +{{ files.length - 2 }} File(s)
                    </span>
                  </template>
                </v-file-input>
                <center>
                  <v-btn
                    :loading="loading3"
                    :disabled="loading3"
                    color="blue-grey"
                    class="ma-2 white--text"
                    @click="uploadML()"
                  >
                    อัพโหลด
                    <v-icon right dark> mdi-cloud-upload </v-icon>
                  </v-btn>
                  <br />
                  <v-progress-linear
                    v-show="progress"
                    v-model="percentCompleted"
                    height="25"
                  >
                    <strong>{{ Math.ceil(percentCompleted) }}%</strong>
                  </v-progress-linear>
                </center>
              </div>

              <div>
                <v-card-title>
                  ประวัติการอัพเดต
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headersML"
                  :items="MLUpHistory"
                  :search="search"
                  :sort-by="['date', 'time']"
                  :sort-desc="[true, true]"
                  multi-sort
                ></v-data-table>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>

    <Myfooter />
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import appbar from "@/components/appbar";
import Myfooter from "@/components/Myfooter";
import axios from "axios";
import moment from "moment";
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
      items: ["alert", "success"],
      headers: [
        {
          text: "วันเดือนปี",
          align: "start",
          value: "Date",
        },
        { text: "หัวข้อ", value: "Title" },
        { text: "เนื้อหา", value: "Detail" },
        { text: "ชนิด", value: "type" },
        { text: "ผู้ส่ง", value: "User" },
      ],
      headersML: [
        {
          text: "อัพเดตล่าสุด",
          align: "start",
          value: "date",
        },
        { text: "เวลา", value: "time" },
        { text: "ชื่อไฟล์", value: "filename" },
        { text: "ขนาด", value: "size" },
      ],
      progress: false,
      percentCompleted: 0,
      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      loading3: false,
      files: [],
      disabled: false,
      ClassName: [],
      TitleName: [],
      BeeSCP: [],
      add_classname: "",
      add_titleName: "",
      add_BeeSCP: "",
      dialog: false,
      editthis: "",
      editIndex: "",
      editText: "",
      systemStatus: [],
      titleStatus: "",
      detailStatus: "",
      typeStatus: "",
      search: "",
      MLUpHistory: [],
      MLfilename: "",
      MLsize: "",
    };
  },
  methods: {
    updateStatus() {
      if (
        this.detailStatus.length == 0 ||
        this.titleStatus.length == 0 ||
        this.typeStatus.length == 0
      ) {
        // <v-alert type="error">กรุณากรอกข้อมูลให้ครบ</v-alert>;
        this.snackbar2 = true;
      } else {
        db.collection("SystemStatus")
          .add({
            Detail: this.detailStatus,
            Title: this.titleStatus,
            User: "Admin",
            type: this.typeStatus,
            Date: moment().format("DD/MM/YYYY"),
          })
          .then(() => {
            this.snackbar = true;
            this.systemStatus = [];
            this.getSystem();
            this.titleStatus = "";
            this.detailStatus = "";
            this.typeStatus = "";
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    },
    getSystem() {
      db.collection("SystemStatus")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            this.systemStatus.push(doc.data());
            // console.log(this.systemStatus.length);
          });
        });
    },
    getColor(status) {
      if (status == "success") return "green";
      else return "blue";
    },

    uploadML() {
      if (this.files.length == 0) {
        this.snackbar3 = true;
      } else {
        this.progress = true;
        this.loading3 = true;
        // console.log(this.files[0]);
        var axios = require("axios");
        var FormData = require("form-data");
        var data = new FormData();
        data.append("file", this.files[0]);

        var config = {
          method: "post",
          url: "https://3.138.195.177:8000/updatemodel/",
          headers: {},
          data: data,
          onUploadProgress: (progressEvent) => {
            this.percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // console.log(this.percentCompleted);
          },
        };

        axios(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            this.snackbar = true;
            this.loading3 = false;
            this.progress = false;
            this.saveHistory();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    getFileData() {
      // console.log(this.files[0]);
      this.MLfilename = this.files[0].name;
      this.MLsize = (this.files[0].size / (1000 * 1000)).toFixed(2);
      // console.log(this.MLfilename);
    },
    saveHistory() {
      db.collection("UpdateMLHistory")
        .add({
          date: moment().format("DD/MM/YYYY"),
          time: moment().format("HH:mm:ss"),
          filename: this.MLfilename,
          size: this.MLsize + " Mb",
        })
        .then((docRef) => {
          this.files = [];
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },

    editItem(item, cs) {
      this.editText = item;
      this.editthis = item;
      this.editIndex = cs;
      this.dialog = true;
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
    save() {
      if (this.editIndex == "T") {
        const index = this.TitleName.indexOf(this.editthis);
        if (index > -1) {
          this.TitleName.splice(index, 1, this.editText);
        }
        var washingtonRef = db.collection("setting").doc("NameTitle");

        return washingtonRef
          .update({
            index: this.TitleName,
          })
          .then(() => {
            this.getAllTname();
            this.snackbar = true;
            this.dialog = false;
          })
          .catch(function (error) {
            console.error("Error updating document: ", error);
          });
      } else if (this.editIndex == "B") {
        const index = this.BeeSCP.indexOf(this.editthis);
        if (index > -1) {
          this.BeeSCP.splice(index, 1, this.editText);
        }
        var washingtonRef = db.collection("setting").doc("BeeSpecies");

        // Set the "capital" field of the city 'DC'
        return washingtonRef
          .update({
            index: this.BeeSCP,
          })
          .then(() => {
            this.getAllTname();
            this.snackbar = true;
            this.dialog = false;
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else {
        const index = this.ClassName.indexOf(this.editthis);
        if (index > -1) {
          this.ClassName.splice(index, 1, this.editText);
        }
        var washingtonRef = db.collection("setting").doc("ClassName");

        // Set the "capital" field of the city 'DC'
        return washingtonRef
          .update({
            index: this.ClassName,
          })
          .then(() => {
            var axios = require("axios");

            var config = {
              method: "get",
              url: "https://3.138.195.177:8000/getclass",
              headers: {},
            };

            axios(config)
              .then(function (response) {
                // console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });

            this.getAllTname();
            this.snackbar = true;
            this.dialog = false;
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    },
    addData(id) {
      if (id == "T") {
        this.TitleName.push(this.add_titleName);
        this.add_titleName = "";
        var washingtonRef = db.collection("setting").doc("NameTitle");

        // Set the "capital" field of the city 'DC'
        return washingtonRef
          .update({
            index: this.TitleName,
          })
          .then(() => {
            this.getAllTname();
            this.snackbar = true;
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else if (id == "B") {
        this.BeeSCP.push(this.add_BeeSCP);
        this.add_BeeSCP = "";
        var washingtonRef = db.collection("setting").doc("BeeSpecies");

        // Set the "capital" field of the city 'DC'
        return washingtonRef
          .update({
            index: this.BeeSCP,
          })
          .then(() => {
            this.getAllBeeSCP();
            this.snackbar = true;
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else {
        this.ClassName.push(this.add_classname);
        this.add_classname = "";
        var washingtonRef = db.collection("setting").doc("ClassName");

        // Set the "capital" field of the city 'DC'
        return washingtonRef
          .update({
            index: this.ClassName,
          })
          .then(() => {
            this.getAllClassName();
            this.snackbar = true;
            var axios = require("axios");

            var config = {
              method: "get",
              url: "https://3.138.195.177:8000/getclass",
              headers: {},
            };

            axios(config)
              .then(function (response) {
                // console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    },
    deleteTitleName(item) {
      const index = this.TitleName.indexOf(item);
      if (index > -1) {
        this.TitleName.splice(index, 1);
      }
      var washingtonRef = db.collection("setting").doc("NameTitle");

      // Set the "capital" field of the city 'DC'
      return washingtonRef
        .update({
          index: this.TitleName,
        })
        .then(() => {
          this.getAllTname();
          this.snackbar = true;
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    deleteClassName(item) {
      const index = this.ClassName.indexOf(item);
      if (index > -1) {
        this.ClassName.splice(index, 1);
      }
      var washingtonRef = db.collection("setting").doc("ClassName");

      // Set the "capital" field of the city 'DC'
      return washingtonRef
        .update({
          index: this.ClassName,
        })
        .then(() => {
          this.getAllTname();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    deleteBeeSCP(item) {
      const index = this.BeeSCP.indexOf(item);
      if (index > -1) {
        this.BeeSCP.splice(index, 1);
      }
      var washingtonRef = db.collection("setting").doc("BeeSpecies");

      // Set the "capital" field of the city 'DC'
      return washingtonRef
        .update({
          index: this.BeeSCP,
        })
        .then(() => {
          this.getAllTname();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
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
    getAllBeeBox() {
      db.collection("BeeBox").onSnapshot((snapshot) => {
        var BeeBox = [];
        snapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          BeeBox.push(doc.data());
          this.$store.state.AllBeeBox = BeeBox.length;
        });
      });
    },
    getAllClassName() {
      this.ClassName = [];
      var docRef = db.collection("setting").doc("ClassName");
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data()["index"]);
            doc.data()["index"].forEach((element) => {
              this.ClassName.push(element);
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
    getMlHistory() {
      db.collection("UpdateMLHistory").onSnapshot(
        (snapshot) => {
          this.MLUpHistory = [];
          snapshot.forEach((doc) => {
            this.MLUpHistory.push(doc.data());
          });
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  created() {
    this.getdata();
    this.getAllUser();
    this.getAllBeeBox();
    this.getAllClassName();
    this.getAllTname();
    this.getAllBeeSCP();
    this.getSystem();
    this.getMlHistory();
  },
  components: {
    appbar,
    Myfooter,
  },
};
</script>

<style>
.panelpd {
  padding-bottom: 150px;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 50px;
}
.chps {
  padding-right: 20px;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
