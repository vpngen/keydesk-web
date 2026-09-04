import {defineStore} from 'pinia';
import {ref} from 'vue';
import * as proApi from '@/api/pro';

export const useProBillingStore = defineStore('proBilling', () => {
  const status = ref('paid');
  const invoices = ref([]);
  // Текущий неоплаченный инвойс с реального бэкенда (null в мок-режиме).
  const currentInvoice = ref(null);
  const isReal = ref(false);
  const isLoaded = ref(false);

  const fetchBilling = async () => {
    const [billing, past] = await Promise.all([
      proApi.fetchProBilling(),
      proApi.fetchProInvoices(),
    ]);
    status.value = billing.status;
    currentInvoice.value = billing.current || null;
    isReal.value = Boolean(billing.real);
    invoices.value = past;
    isLoaded.value = true;
  };

  const payCurrentInvoice = async () => {
    const r = await proApi.payProInvoice();
    status.value = r.status || 'paid';
    if (isReal.value) {
      await fetchBilling();
    }
  };

  return {
    status,
    invoices,
    currentInvoice,
    isReal,
    isLoaded,
    fetchBilling,
    payCurrentInvoice,
  };
});
