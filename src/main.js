import { createApp } from 'vue'

import App from './App.vue'
import "./styles.css"
import SlotComp from './components/SlotComp.vue'

const app = createApp(App)
app.component('slot-comp', SlotComp)
app.mount('#app')
                  
