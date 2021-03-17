<template>
  <div>
    <div>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <br /><br />
          <v-card-text>ต้องการออกจากระบบหรือไม่ ?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false"
              >ไม่</v-btn
            >
            <v-btn color="green darken-1" text @click="logout">ใช่</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-app-bar app color="white" elevation="1">
      <v-app-bar-nav-icon
        @click.stop="sidebarMenu = !sidebarMenu"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div class="text-center" v-if="ststus == 'User'">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-badge overlap color="red" :content="itemscount">
              <v-btn small dark icon v-bind="attrs" v-on="on">
                <v-icon color="primary">mdi-bell</v-icon>
              </v-btn>
            </v-badge>
          </template>
          <systemstatus v-bind:itemcount="systemItems" />
        </v-menu>
      </div>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon @click="dialogTologout">
            <i class="fas fa-sign-out-alt fa-lg"></i>]
          </v-btn>
        </template>
        <span>กดเพื่ออกจากระบบ</span>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
    >
      <v-list dense color="white" dark>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-img
                max-width="400"
                max-height="32"
                src="../assets/icon.png"
                alt="logo"
              ></v-img>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list-item class="px-2" @click="toggleMini = !toggleMini">
        <v-list-item-avatar>
          <v-icon>mdi-account-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="text-truncate fontcss">{{
          $store.state.username
        }}</v-list-item-content>
      </v-list-item>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.href"
          v-show="item.show"
        >
          <v-list-item-icon>
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="primary--text fontcss">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container class="px-4 py-0 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import firebase from "firebase";
import systemstatus from "../components/Home/SystemStatus";
import { db } from "@/main";
export default {
  beforeCreate() {
    firebase.auth().onAuthStateChanged((user) => {
      user.getIdTokenResult().then((idTokenResult) => {
        this.ststus = idTokenResult.claims.User;
        if (idTokenResult.claims.User == "Admin") {
          this.items = [
            {
              title: "แดชบอร์ด",
              href: "/home",
              icon: "mdi-chart-bar",
              show: true,
            },
            {
              title: "จัดการฟาร์ม",
              href: "/MagagerFarm",
              icon: "mdi-barn",
              show: true,
            },
            {
              title: "จัดการจุดที่ตั้ง",
              href: "/LocationManager",
              icon: "mdi-map-marker",
              show: true,
            },
            {
              title: "จัดการผู้ใช้",
              href: "/userManager",
              icon: "mdi-account-search",
              show: true,
            },
            {
              title: "ตั้งค่า",
              href: "/settings",
              icon: "mdi-cog",
              show: true,
            },
          ];
        } else if (idTokenResult.claims.User == "User") {
          this.items = [
            {
              title: "แดชบอร์ด",
              href: "/HomeUser",
              icon: "mdi-chart-bar",
              show: true,
            },
            {
              title: "จัดการผู้ใช้",
              href: "/accountManager",
              icon: "mdi-account-search",
              show: true,
            },
            {
              title: "จัดการฟาร์ม",
              href: "/userFarm",
              icon: "mdi-barn",
              show: true,
            },
            {
              title: "จัดการจุดที่ตั้ง",
              href: "/User_Locations",
              icon: "mdi-map-marker",
              show: true,
            },
            {
              title: "จัดการกล่องผึ้ง",
              href: "/Boxmanager",
              icon: "mdi-collage",
              show: true,
            },
            {
              title: "ตั้งค่า",
              href: "/settings",
              icon: "mdi-cog",
              show: false,
            },
          ];
        }
      });
    });
  },
  data: () => ({
    dialog: false,
    sidebarMenu: true,
    toggleMini: false,
    items: [],
    systemItems: [],
    itemscount: 0,
    ststus: "",
  }),
  created() {
    this.getSystem();
  },

  components: {
    systemstatus,
  },
  methods: {
    dialogTologout() {
      this.dialog = true;
    },
    logout: function () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/");
        });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    getSystem() {
      db.collection("SystemStatus")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.systemItems.push(doc.data());

            // console.log(this.systemItems)

            this.systemItems.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.Date) - new Date(a.Date);
            });
            this.itemscount = this.systemItems.length;

            // console.log(doc.id, " => ", doc.data());
          });
        });
    },
  },
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
    },
    // buttonText() {
    //   return !this.$vuetify.theme.dark ? "Go Dark" : "Go Light";
    // },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Mitr&display=swap");
#myicons {
  color: rgb(190, 20, 20);
  text-shadow: 1px 1px 1px #ccc;
  font-size: 1.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.theme--light.v-application ::-webkit-scrollbar {
  width: 13px;
}

.theme--light.v-application ::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}

.theme--light.v-application ::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 3px #e6e6e6;
  border-radius: 7px;
}

.theme--light.v-application ::-webkit-scrollbar-thumb:hover {
  background: rgb(141, 141, 141);
}

.theme--dark.v-application ::-webkit-scrollbar {
  width: 13px;
}

.theme--dark.v-application ::-webkit-scrollbar-track {
  background: #797979;
  border-left: 1px solid #2c2c2c;
}

.theme--dark.v-application ::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border: solid 3px #202020;
  border-radius: 7px;
}

.theme--dark.v-application ::-webkit-scrollbar-thumb:hover {
  background: white;
}

html,
body {
  font-family: "Mitr", sans-serif;
}

#app {
  font-family: "Mitr", sans-serif;
}
</style>
