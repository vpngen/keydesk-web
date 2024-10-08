import { createRouter, createWebHistory } from 'vue-router';
import { homePage, notificationsPage } from '@/pages';

const router = createRouter({
  scrollBehavior: ()=> document.getElementById('app').scrollIntoView({ behavior: 'smooth' }),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: homePage,
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: notificationsPage,
    },
  ],
});

export default router;
