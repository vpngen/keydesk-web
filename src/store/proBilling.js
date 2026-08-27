import {defineStore} from 'pinia';
import {ref} from 'vue';
import * as proApi from '@/api/pro';

export const useProBillingStore = defineStore('proBilling', () => {
  const status = ref('paid');
  const invoices = ref([]);
  const isLoaded = ref(false);

  const fetchBilling = async () => {
    const [billing, past] = await Promise.all([
      proApi.fetchProBilling(),
      proApi.fetchProInvoices(),
    ]);
    status.value = billing.status;
    invoices.value = past;
    isLoaded.value = true;
  };

  const payCurrentInvoice = async () => {
    await proApi.payProInvoice();
    status.value = 'paid';
  };

  return {
    status,
    invoices,
    isLoaded,
    fetchBilling,
    payCurrentInvoice,
  };
});
