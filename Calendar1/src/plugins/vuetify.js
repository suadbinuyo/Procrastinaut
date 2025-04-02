// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VApp, VSelect, VSheet } from 'vuetify/components'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

// Vuetify
import { createVuetify } from 'vuetify'



export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  components: {
    VCalendar,
    VApp,
    VSelect,
    VSheet,
    VDateInput,
    VTimePicker,
  },
})
