import { createApp } from 'vue'
import App from './App.vue'

import '@/style/index.scss'

import router from '@/router'
import pinia from '@/store'
import plugins from '@/plugins'

createApp(App).use(router).use(pinia).use(plugins).mount('#app')
