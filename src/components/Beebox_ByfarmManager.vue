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

    <v-dialog v-model="dialoglocation" transition="dialog-bottom-transition">
      <template>
        <v-card>
          <v-toolbar color="primary" dark>เลือกจุดที่ตั้ง</v-toolbar>

          <div>
            <v-data-table
              :headers="headersLocation"
              :items="Location"
              :search="search"
              loading-text="........"
              sort-by="date"
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
                <v-icon small class="mr-2" @click="SelectLoca(item)"
                  >mdi-check-circle</v-icon
                >
              </template>
            </v-data-table>
          </div>

          <v-card-actions class="justify-end">
            <v-btn text @click="dialoglocation = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="Beelen"
      :search="search"
      loading-text="........"
      sort-by="num"
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="locaselect"
                        label="เลือกจุดที่ตั้ง"
                        @click="dialoglocation = true"
                      ></v-text-field>
                    </v-col>
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
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>

      <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>-->
    </v-data-table>
  </div>
</template>

<script>
import { db } from "@/main";
import firebase from "firebase";
import moment from "moment";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
      } else {
        this.$router.replace("/");
      }
    });
  },
  data() {
    return {
      snackbar: false,
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
          text: "ID",
          align: "start",
          sortable: true,
          value: "num",
        },
        {
          text: "ชื่อ",
          value: "Name",
        },
        {
          text: "ชนิดของแมลง",
          value: "Species",
        },
        {
          text: "อัพเดทล่าสุด",
          value: "Created",
        },
        {
          text: "จุดที่ตั้ง",
          value: "LocationName",
        },

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
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Box" : "Edit Box";
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
  created() {
    this.getBeeBox();
    this.getLocation();
  },
  methods: {
    getBeeBox() {
      this.Beelen = [];
      db.collection("BeeBox")
        .where("Idfarm", "==", this.$store.state.BeeboxByFarm)
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
    getLocation() {
      this.Location = [];
      db.collection("LocationBox")
        .where("IdFarm", "==", this.$store.state.BeeboxByFarm)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            this.Location.push({
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
          });
        });
    },

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
      console.log(this.location_name);
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
            this.getBeeBox();
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
    },
    deletebyBox(id) {
      var jobskill_query = db.collection("History").where("BoxId", "==", id);
      jobskill_query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
    },
    detail(item) {
      this.editedIndex = this.Farm.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // console.log(item.id);
      this.$router.push({
        name: "Detail",
        params: {
          Detail: item.id,
        },
      });
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
        this.getBeeBox();
        this.close();
      } else {
        if (this.editedIndex === -1) {
          db.collection("BeeBox")
            .add({
              Name: this.Name,
              Created: this.time,
              Species: this.Species,
              num: this.$store.state.Beebox + 1,
              Idfarm: this.$store.state.BeeboxByFarm,
              Location: this.selectloca_id ?? "",
              LocationName: this.location_name,
              FarmName: this.$store.state.FarmName,
            })
            .then((id) => {
              // console.log("Document successfully updated!");
              this.snackbar = true;
              this.updateIdbox(id.id);
              this.getBeeBox();
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
              FarmName: this.$store.state.FarmName,
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
