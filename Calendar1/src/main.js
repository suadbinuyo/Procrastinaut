import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueTextareaAutosize from 'vue-textarea-autosize'
import { initializeApp } from "firebase/app";
//import { getFirestore} from 'firebase/firestore'
import "@/assets/styles.css";
import { getDatabase } from "firebase/database";
import { VDateInput } from 'vuetify/lib/labs/components.mjs'
import { createVuetify } from 'vuetify/lib/framework.mjs'
import { VTimePicker } from 'vuetify/lib/labs/components.mjs'

const firebaseConfig = {
  apiKey: "AIzaSyDxujXHN4XbirVSxLkp6wkwabMK4bKfE-o",

  authDomain: "calendar--1-d19db.firebaseapp.com",

  projectId: "calendar--1-d19db",

  storageBucket: "calendar--1-d19db.firebasestorage.app",

  messagingSenderId: "369190286445",

  appId: "1:369190286445:web:652f3437ca8e0501d17b64",

  measurementId: "G-D1S6S035R5",

  databaseURL: "https://calendar--1-d19db-default-rtdb.europe-west1.firebasedatabase.app/"

};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
//export const db = getFirestore(app);
loadFonts()

createApp(App)
  .use(vuetify)
  .use(VueTextareaAutosize)
  .mount('#app')

  export default createVuetify({
    components: {
      VDateInput,
      VTimePicker,
    },
  })