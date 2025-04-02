
<template>
  <div>
 
      <v-toolbar color="deep-purple-darken-4">
        <v-dialog
      v-model="dialog"
      max-width="600"
    >
        <template v-slot:activator="{ props: activatorProps }">
        <v-btn 
        class="text-none font-weight-regular" 
        block variant="tonal"
        text="Add event"
        v-bind="activatorProps">
      </v-btn>
      </template>
      <v-card
      title="Add event">
        <v-card-text>
          <v-row dense>
            <v-col
            cols="12"
            md="4"
            sm="6"
            >
            <v-text-field
            variant="solo-filled"
            clearable
            hint="Enter event name"
            label="Name"
            required
            color="indigo">
            </v-text-field>        
        </v-col>
        <v-spacer></v-spacer>
      <v-col
      cols="12"
      md="4"
      sm="6" 
      >
      <div class="d-flex justify-center">
      <v-date-input
        v-model="model"
        label="Date"
        prepend-icon=""
        prepend-inner-icon="$calendar"
        max-width="368"
        multiple="range"
        clearable
        required
        variant="solo-filled"
        color="indigo">
      </v-date-input>
    </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-container>
    <v-row justify="space-around">
      <v-col
        cols="12"
        md="4"
        sm="6"
      >
        <v-text-field
          variant="solo-filled"
          clearable
          v-model="timeStart"
          :active="menuStart"
          :focus="menuStart"
          label="Start time"
          prepend-icon="mdi-clock-time-four-outline"
          required
          color="indigo"
          header-color="indigo"
        >
          <v-menu
            v-model="menuStart"
            :close-on-content-click="true"
            activator="parent"
            transition="scale-transition"
          >
            <v-time-picker
              variant="solo-filled"
              scrollable
              format="24hr"
              elevation="15"
              header-color="indigo"
              color="indigo"
              v-if="menuStart"
              v-model="timeStart"
              full-width
            ></v-time-picker>
          </v-menu>
        </v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        md="4"
        sm="6"
      >
        <v-text-field
         variant="solo-filled"
          clearable
          v-model="timeEnd"
          :active="menuEnd"
          :focus="menuEnd"
          label="End time"
          prepend-icon="mdi-clock-time-four-outline"
          required
          color="indigo"
          header-color="indigo"
        >
          <v-menu
            v-model="menuEnd"
            :close-on-content-click="true"
            activator="parent"
            transition="scale-transition"
          >
            <v-time-picker
              variant="solo-filled"
              scrollable
              format="24hr"
              elevation="15"
              color="indigo"
              header-color="indigo"
              v-if="menuEnd"
              v-model="timeEnd"
              full-width
            ></v-time-picker>
          </v-menu>
        </v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
          </v-row>
          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            variant="plain"
            @click="dialog = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      </v-toolbar>
      
      <v-sheet
      color="deep-purple-darken-4"
        class="d-flex"
        height="54"
        tile
      >
        <v-select
          v-model="type"
          :items="types"
          class="ma-2"
          density="compact"
          label="View Mode"
          variant="outlined"
          hide-details
        ></v-select>
        <v-select
          v-model="weekday"
          :items="weekdays"
          class="ma-2"
          density="compact"
          label="weekdays"
          variant="outlined"
          hide-details
        ></v-select>
      </v-sheet>
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="value"
          :events="events"
          :view-mode="type"
          :weekdays="weekday"
        ></v-calendar>
      </v-sheet>
    </div>
  </template>
  <script>
  import { ref } from 'vue'

  const timeStart = ref(null)
  const timeEnd = ref(null)
  const menuStart = ref(false)
  const menuEnd = ref(false)
  const modal2 = ref(false)

  import { shallowRef } from 'vue'

  const model = shallowRef(null)

  import { useDate } from 'vuetify'

  import { database } from '@/main'

  export default {
        name:  'CalendarComponent',

      data: () => ({
        timeStart: null,
        timeEnd: null,
        menu2: null,
        modal2: null,
        ref: null,
        model: null,
        dialog:  false,
        type: 'month',
        types: ['month', 'week', 'day'],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        weekdays: [
          { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
          { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
          { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
          { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
        ],
        /*name: null,
        details: null,
        start: null,
        end: null,
        currentlyEditing: null,
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        dialogue: false,*/

        value: [new Date()],
        events: [],
        colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1' , 'orange'],
        titles: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party' , 'Homework'],

      }),
      mounted () {
        const adapter = useDate()
        this.getEvents({ start: adapter.startOfDay(adapter.startOfMonth(new Date())), end: adapter.endOfDay(adapter.endOfMonth(new Date())) })
      },
      methods: {
        addEvents(title, color, startDate, endDate){
          this.events.push({
            title,
            start: new Date(startDate),
            end: new Date(endDate),
              color,
              allDay: true,
          });
        },
        getEvents ({ start, end }) {
          const events = []
          
          const min = start
          const max = end
          const days = (max.getTime() - min.getTime()) / 86400000
          const eventCount = this.rnd(days, days + 20)
  
          for (let i = 0; i < eventCount; i++) {
            const allDay = this.rnd(0, 3) === 0
            const firstTimestamp = this.rnd(min.getTime(), max.getTime())
            const first = new Date(firstTimestamp - (firstTimestamp % 900000))
            const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
            const second = new Date(first.getTime() + secondTimestamp)
  
            events.push({
              title: this.titles[this.rnd(0, this.titles.length - 1)],
              start: first,
              end: second,
              color: this.colors[this.rnd(0, this.colors.length - 1)],
              allDay: !allDay,
            })
          }
  
          this.events = events
          this.addEvents('Porject' , 'indigo' , '2025-05-22' , '2025-05-23')
        },
        getEventColor (event) {
          return event.color
        },
        rnd (a, b) {
          return Math.floor((b - a + 1) * Math.random()) + a
        },
      },
    }
  
  </script>

  

