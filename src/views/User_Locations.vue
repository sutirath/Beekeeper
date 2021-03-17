<template>
  <div class="bg">
    <appbar />

    <div class="container">
      <center>
        <h1>จัดการจุดที่ตั้ง</h1>
      </center>
      <br><br>
      <div class="locapad">
        <v-data-table
          :headers="headers"
          :items="Locations"
          :search="search"
          loading-text="........"
          sort-by="date"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>จัดการจุดที่ตั้ง</v-toolbar-title>
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

              <v-dialog v-model="dialog" max-width="700px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
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
                            label="ที่อยู่"
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
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save"
                      >บันทึก</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item.id="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
            <v-icon small class="mr-2" @click="deleteItem(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
      </div>
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
import ThailandAutoComplete from "vue-thailand-address-autocomplete";
import Myfooter from "@/components/Myfooter";
import BeeTable from "@/components/Beebox_ByfarmManager";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var displayName = user.displayName;
        var Uid = user.uid;
        this.$store.state.username = displayName;
        this.$store.state.Uid = Uid;
        user.getIdTokenResult().then((idTokenResult) => {
          this.$store.state.FramId = idTokenResult.claims.Farm;
          this.getdata(idTokenResult.claims.Farm)
          this.getLocations(idTokenResult.claims.Farm);
        });
      } else {
        this.$router.replace("/");
      }
    });
  },
  data() {
    return {
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
      id: this.$route.params.Detail,
      formatted: "",
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
          sortable: true,
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
          text: "Actions",
          value: "id",
          sortable: false,
        },
      ],
      editedIndex: -1,
      FarmName: "",
      editid: "",
      status: "",
      food: "",
      Name: "",
      Owner: "",
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

          this.FarmName = doc.data().Name;
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
    select(address) {
      this.district = address.district;
      this.amphoe = address.amphoe;
      this.province = address.province;
      this.zipcode = address.zipcode;
    },

    getLocations(id) {
      /////////////getdata/////////////
      db.collection("LocationBox")
        .where("IdFarm", "==", id)
        .onSnapshot((snapshot) => {
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
          });
        });
    },
    editItem(item) {
      this.editedIndex = this.Locations.indexOf(item);
      // this.editedItem = Object.assign({}, item);

      this.Name = item.Name;
      this.date = item.date;
      this.status = item.status;
      this.food = item.food;
      this.Address = item.Address;
      this.district = item.district;
      this.amphoe = item.amphoe;
      this.province = item.province;
      this.zipcode = item.zipcode;

      this.editid = item.id;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editid = item.id;
      const index = this.Locations.indexOf(item);
      confirm("Are you sure you want to delete ?") &&
        db
          .collection("LocationBox")
          .doc(this.editid)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.Name = "";
        this.date = "";
        this.status = "";
        this.food = "";
        this.Address = "";
        this.district = "";
        this.amphoe = "";
        this.province = "";
        this.zipcode = "";
        this.editedIndex = -1;
      });
    },
    save() {
      this.Locations = [];
      if (
        this.Name == "" ||
        this.date == "" ||
        this.status == "" ||
        this.food == "" ||
        this.Address == "" ||
        this.district == "" ||
        this.amphoe == "" ||
        this.province == "" ||
        this.zipcode == ""
      ) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        this.getLocations();
        this.close();
      } else {
        if (this.editedIndex === -1) {
          db.collection("LocationBox")
            .add({
              name: this.Name,
              status: this.status,
              food: this.food,
              date: this.date,
              Farmname: this.FarmName,
              IdFarm: this.$store.state.FramId,
              Address: this.Address,
              district: this.district,
              amphoe: this.amphoe,
              province: this.province,
              zipcode: this.zipcode,
            })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              alert("Success");
              this.getLocations(this.$store.state.FramId);
              this.close();
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        } else {
          var updateRef = db.collection("LocationBox").doc(this.editid);
          return updateRef
            .update({
              name: this.Name,
              status: this.status,
              food: this.food,
              date: this.date,
              Farmname: this.FarmName,
              IdFarm: this.$store.state.FramId,
              Address: this.Address,
              district: this.district,
              amphoe: this.amphoe,
              province: this.province,
              zipcode: this.zipcode,
            })
            .then(() => {
              console.log("Document successfully updated!");
              alert("Success");
              this.getLocations(this.$store.state.FramId);
              this.close();
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        }
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มจุดที่ตั้ง" : "แก้ไขจุดที่ตั้ง";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  components: {
    appbar,
    Myfooter,
    BeeTable,
    ThailandAutoComplete,
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
.bg {
  background-color: #f8f9fa;
}
.locapad {
  padding-bottom: 20px;
}
</style>
