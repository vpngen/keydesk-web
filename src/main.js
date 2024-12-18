import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import loadingService from "@/assets/services/loading-service";

const app = createApp(App);
const pinia = createPinia()

app.config.globalProperties.window = window
app.provide('loadingService', loadingService);
app.use(pinia)
app.use(router);
app.mount('#app');
