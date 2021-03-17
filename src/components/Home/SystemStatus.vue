<template>
  <div>
    <v-card class="mx-auto" max-width="500">
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>อัพเดตสถานะระบบ</v-toolbar-title>
      </v-toolbar>

      <v-list two-line>
        <v-list-item-group >
          <template v-for="(item, index) in itemcount">
            <v-list-item :key="item.Title" :class="setcolors(item.type)">
              <template>
                <v-list-item-content>
                  <v-list-item-title v-text="item.Date"></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.Title"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="item.Detail"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text
                    v-text="item.User"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider v-if="index < itemcount.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>

export default {
  props:["itemcount"],
  methods: {
    setcolors(status) {
      if (status == "success") {
        return "green accent-1";
      } else {
        return "red lighten-4";
      }
    },
  },
};
</script>

<style>
</style>