// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VApp, VSelect, VSheet } from 'vuetify/components'

// Vuetify
import { createVuetify } from 'vuetify'



export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  components: {
    VCalendar,
    VApp,
    VSelect,
    VSheet,
  },
})
