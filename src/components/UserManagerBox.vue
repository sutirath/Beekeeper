<template>
  <div>
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

    <v-data-table
      :headers="headers"
      :items="Beelen"
      :search="search"
      loading-text="........"
      sort-by="Name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>จัดการกล่องเลี้ยงผึ้ง</v-toolbar-title>
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
                >เพิ่มกล่องผึ้ง</v-btn
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
                      <v-text-field v-model="Name" label="ชื่อ"></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="Created" label="Created"></v-text-field>
                  </v-col> -->
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="sbee"
                        label="ชนิดของแมลง"
                        v-model="Species"
                      ></v-select>
                    </v-col>
                    <!-- <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="locaselect"
                        label="เลือกจุดที่ตั้ง"
                        @click="dialoglocation = true"
                      ></v-text-field>
                    </v-col> -->
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">ปิด</v-btn>
                <v-btn color="blue darken-1" text @click="save">บันทึก</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.id="{ item }">
        <v-icon big class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon big class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon big @click="gennarateQR(item)">mdi-qrcode</v-icon>

        <v-icon big class="mr-2" @click="detail(item)">mdi-history</v-icon>
      </template>
    </v-data-table>

    <div class="text-center">
      <v-dialog v-model="dialog2" width="400">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            <H3>{{ Qrtitle }}</H3>
          </v-card-title>
          <center>
            <qrcode-vue
              :value="value"
              size="200"
              level="H"
              :class="Qrtitle"
            ></qrcode-vue>
          </center>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog2 = false"> OK </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import moment from "moment";
import QrcodeVue from "qrcode.vue";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      user.getIdTokenResult().then((idTokenResult) => {
        //   console.log(idTokenResult.claims.Farm)
        this.farmID = idTokenResult.claims.Farm;
        this.getBeeBox(idTokenResult.claims.Farm);
        // this.getLocation(idTokenResult.claims.Farm);
        this.getFarm(idTokenResult.claims.Farm);
      });
      if (!user) {
        this.$router.replace("/");
      } else {
        var displayName = user.displayName;
        var Uid = user.uid;
        this.$store.state.username = displayName;
        this.$store.state.Uid = Uid;
      }
    });
  },
  data() {
    return {
      Qrtitle: "",
      dialog2: false,
      value: "",
      farmID: "",
      farmName: "",
      dialoglocation: false,
      Beelen: [],
      search: "",
      dialog: false,
      sbee: ["ผึ้งพันธ์ุ"],
      Location: [],
      locaselect: "",
      headersLocation: [
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
      headers: [
        {
          text: "ชื่อ",
          align: "start",
          sortable: true,
          value: "Name",
        },
        // {
        //   text: "ชื่อ",
        //   value: "Name",
        // },
        {
          text: "ชนิดของแมลง",
          value: "Species",
        },
        {
          text: "อัพเดทล่าสุด",
          value: "Created",
        },
        // {
        //   text: "จุดที่ตั้ง",
        //   value: "LocationName",
        // },

        {
          value: "id",
          sortable: false,
        },
      ],
      editedIndex: -1,

      editedItem: {
        Name: "",
        Species: "",
      },
      Name: "",
      Species: "",
      Created: "",
      editid: "",
      selectloca_id: "",
      location_name: "",
      snackbar: false,
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่ม" : "แก้ไข";
    },
    time() {
      return moment().format("DD/MM/YYYY");
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  components: {
    QrcodeVue,
  },
  methods: {
    getBeeBox(uid) {
      this.Beelen = [];
      db.collection("BeeBox")
        .where("Idfarm", "==", uid)
        .onSnapshot((snapshot) => {
          this.Beelen = [];
          snapshot.forEach((doc) => {
            this.Beelen.push({
              id: doc.id,
              Created: doc.data().Created,
              Idfarm: doc.data().Idfarm,
              Name: doc.data().Name,
              num: doc.data().num,
              Species: doc.data().Species,
              LocationName: doc.data().LocationName,
            });
            this.$store.state.Beebox = this.Beelen.length;
          });
        });
    },
    getFarm(id) {
      var docRef = db.collection("Farm").doc(id);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
            this.farmName = doc.data().Name;
            // console.log(this.farmName);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    // getLocation(id) {
    //   this.Location = [];
    //   db.collection("LocationBox")
    //     .where("IdFarm", "==", id)
    //     .onSnapshot((snapshot) => {
    //       snapshot.forEach((doc) => {
    //         this.Location.push({
    //           id: doc.id,
    //           Name: doc.data().name,
    //           farmName: doc.data().Farmname,
    //           IdFarm: doc.data().IdFarm,
    //           status: doc.data().status,
    //           date: doc.data().date,
    //           food: doc.data().food,
    //           Address: doc.data().Address,
    //           district: doc.data().district,
    //           amphoe: doc.data().amphoe,
    //           province: doc.data().province,
    //           zipcode: doc.data().zipcode,
    //         });
    //       });
    //     });
    // },

    SelectLoca(item) {
      this.selectloca_id = item.id;
      this.location_name =
        item.Name +
        " " +
        item.Address +
        " " +
        item.district +
        " " +
        item.amphoe +
        " " +
        item.province +
        " " +
        item.zipcode;
      this.locaselect = this.location_name;
      // console.log(this.location_name);
      this.dialoglocation = false;
    },

    editItem(item) {
      this.editedIndex = this.Beelen.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.Name = item.Name;
      this.Created = item.Created;
      this.Species = item.Species;
      this.locaselect = item.LocationName;
      this.editid = item.id;
      // console.log(item.id);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editid = item.id;
      const index = this.Beelen.indexOf(item);
      confirm("Are you sure you want to delete ?") &&
        db
          .collection("BeeBox")
          .doc(this.editid)
          .delete()
          .then((edit) => {
            // console.log("Document successfully deleted!");
            this.deletebyBox(this.editid);
            this.getBeeBox(this.farmID);
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
    },
    deletebyBox(id) {
      var jobskill_query = db
        .collection("History")
        .where("BoxId", "==", id);
      jobskill_query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    },
    detail(item) {
      this.editedIndex = this.Beelen.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // console.log(item.id);
      this.$router.push({
        name: "history",
        params: {
          Detail: item.id,
        },
      });
    },

    gennarateQR(id) {
      this.Qrtitle = id.Name;
      this.value = id.id;
      this.dialog2 = true;
    },

    close() {
      this.editid = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.Beelen = [];
      if (this.Name == "" || this.Species == "") {
        alert("Please complete all fields");
        this.getBeeBox(this.farmID);
        this.close();
      } else {
        if (this.editedIndex === -1) {
          db.collection("BeeBox")
            .add({
              Name: this.Name,
              Created: this.time,
              Species: this.Species,
              num: this.$store.state.Beebox + 1,
              Idfarm: this.farmID,
              Location: this.selectloca_id ?? "",
              LocationName: this.location_name,
              FarmName: this.farmName,
            })
            .then((id) => {
              console.log(id.id);
              this.snackbar = true;
              this.updateIdbox(id.id);
              this.getBeeBox(this.farmID);
              this.close();
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        } else {
          var updateRef = db.collection("BeeBox").doc(this.editid);
          return updateRef
            .update({
              Name: this.Name,
              Created: this.Created,
              Species: this.Species,
              Location: this.selectloca_id ?? "",
              LocationName: this.location_name,
              FarmName: this.farmName,
            })
            .then(() => {
              // console.log("Document successfully updated!");
              this.snackbar = true;
              this.close();
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        }
      }
    },

    updateIdbox(id) {
      var washingtonRef = db.collection("BeeBox").doc(id);
      // Set the "capital" field of the city 'DC'
      return washingtonRef
        .update({
          id: id,
        })
        .then(() => {
          // console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
  },
};
</script>

<style></style>
