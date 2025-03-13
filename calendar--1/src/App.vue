<template>
  <v-app>
    <CalendarComponent />
  </v-app>
</template>

<script>
import CalendarComponent from './components/CalendarComponent.vue'

export default {
  name: 'App',

  components: {
    CalendarComponent,
  },

  data: () => ({
    //
  }),
}
</script>
