<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500&display=swap');
html,
body {
  font-family: 'Kanit', sans-serif;
}

#app {
 font-family: 'Kanit', sans-serif;
}
</style>
