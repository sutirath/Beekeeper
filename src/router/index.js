import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Farm from "../views/FarmManager";
import Detail from "../views/FarmManager/Detail_id.vue";
import setting from "../views/setting.vue";
import Box_manager from "../views/UseManager_BoxTable.vue";
import userManager from "../views/userManager.vue";
import HomeUser from "../views/HomeUser.vue";
import userFarm from "../views/userFarm.vue";
import accountManager from "../views/AccountManager.vue";
import LocationManager from "../views/LocationManager";
import locationdetail from "../views/LocationManager/Detail_id.vue";
import history from "../views/History_Box.vue";
import User_Locations from "../views/User_Locations.vue";
import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/MagagerFarm",
    name: "Farm",
    component: Farm,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/MagagerFarm/:Detail",
    name: "Detail",
    component: Detail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/LocationManager",
    name: "LocationManager",
    component: LocationManager,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/LocationManager/:Detail",
    name: "locationdetail",
    component: locationdetail,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/settings",
    name: "setting",
    component: setting,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/userManager",
    name: "userManager",
    component: userManager,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/Boxmanager",
    name: "Boxmanager",
    component: Box_manager,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Boxmanager/:Detail",
    name: "history",
    component: history,
  },

  {
    path: "/HomeUser",
    name: "HomeUser",
    component: HomeUser,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/userFarm",
    name: "userFarm",
    component: userFarm,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/accountManager",
    name: "accountManager",
    component: accountManager,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/User_Locations",
    name: "User_Locations",
    component: User_Locations,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: "/",
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      // Go to login
      firebase.auth().onAuthStateChanged((user) => {
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.User == "Admin") {
            // Show admin UI.
            next({
              path: "/home",
              query: {
                redirect: to.fullPath,
              },
            });
          } else {
            next({
              path: "/HomeUser",
              query: {
                redirect: to.fullPath,
              },
            });
          }
        });
      });
    } else {
      // Proceed to route
      next({});
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;
