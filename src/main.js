import { createApp } from 'vue'
import VueClipboard from 'vue-clipboard2'
import Toast from "vue-toastification";
import App from './App.vue'

import './index.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import "vue-toastification/dist/index.css";


const app = createApp(App)

app.use(VueClipboard)
app.use(Toast)

app.mount('#app');