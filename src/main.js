import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import loadingService from "@/assets/services/loading-service";

const app = createApp(App);
app.provide('loadingService', loadingService);
app.use(router);
app.mount('#app');
