import { createApp } from 'vue'
import App from './App.vue'
import loadingService from "@/assets/services/loading-service";

const app = createApp(App);
app.provide('loadingService', loadingService);
app.mount('#app');
