import 'normalize.css'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import { setupI18n } from './i18n'
import {setupAxiosInterceptors} from './utils/axiosInterceptors';

async function bootstrap() {
  const i18n = await setupI18n()

  const app = createApp(App);
  const pinia = createPinia()

  app.config.globalProperties.window = window
  app.use(pinia)
  setupAxiosInterceptors()
  app.use(i18n)
  app.use(router);
  app.mount('#app');
}

bootstrap().catch((err) => {
  console.error('[i18n]', err)
  const el = document.getElementById('app')
  if (el) {
    el.innerHTML = '<p style="padding:1rem;font-family:sans-serif;">Не удалось загрузить файлы переводов. Обновите страницу или проверьте, что доступны /locales/ru.json и /locales/en.json.</p>'
  }
})
