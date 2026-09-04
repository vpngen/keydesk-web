import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import { homePage, notificationsPage, proInvoicesPage, proAnalyticsPage, proHelpPage } from '@/pages';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { isDevOrStageHost } from '@/const/api';

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
    {
      path: '/invoices',
      name: 'ProInvoices',
      component: proInvoicesPage,
      meta: { proOnly: true },
    },
    {
      path: '/analytics',
      name: 'ProAnalytics',
      component: proAnalyticsPage,
      meta: { proOnly: true },
    },
    {
      path: '/help',
      name: 'ProHelp',
      component: proHelpPage,
      meta: { proOnly: true },
    },
  ],
});

router.beforeEach(async (to) => {
  if (!to.meta.proOnly) return true;

  if (isDevOrStageHost && to.query.pro === 'true') return true;

  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const { isPRO } = storeToRefs(profileStore);

  try {
    await authStore.fetchToken();
  } catch {
    return { path: '/', query: to.query };
  }

  if (isPRO.value) return true;

  return { path: '/', query: to.query };
});

export default router;
